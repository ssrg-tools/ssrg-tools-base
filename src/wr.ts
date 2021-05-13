import got, { HTTPError } from 'got';
import _ from 'lodash';
import { getRepository, IsNull, Not, Repository } from 'typeorm';
import { dalcomGradeMap, WRRecordEntry } from './dalcom';
import { SongWorldRecordArchive } from './entity/Archive/SongWorldRecordArchive';
import { Song } from './entity/Song';
import { SongWorldRecord } from './entity/SongWorldRecord';
import { SuperstarGame } from './entity/SuperstarGame';
import { WorldRecordSeason } from './entity/WorldRecordSeason';
import { generate_guid } from './guid';
import { NumberLike } from './types';
import { createFingerprint } from './utils';

/**
 * 'top100-2021-tie': SSM starting client 3.1.4, July 2021 season
 */
export type WRSeasonType =
  | 'top1-tie'
  | 'top100-no-tie'
  | 'top100-tie'
  | 'top100-2021-3day-tie';

export async function fetchAndInsertSWRForGameAndSeason(
  source: string,
  game: SuperstarGame,
  season: WorldRecordSeason,
  songList: Song[] = undefined,
  Songs = getRepository(Song),
  SongWorldRecords = getRepository(SongWorldRecord),
  SongWorldRecordArchives = getRepository(ASWR),
  verbose = false,
) {
  if (!game.baseUrlRanking) {
    return new Error(`gameKey '${game.key}' not supported, no ranking url.`);
  }

  if (!season.dalcomSeasonId) {
    return new Error(
      `gameKey '${game.key}' season #${season.id} not supported, no dalcom season code.`,
    );
  }

  const buildUrl = _.curry(
    buildUrlRanking(game.baseUrlRanking, season.bonusSystem),
  )(season.dalcomSeasonId);
  const responseText: string[] = [];

  const songs = songList?.length
    ? songList
    : await Songs.find({
        select: ['id', 'name', 'internalSongId'],
        where: {
          gameId: game.id,
          internalSongId: Not(IsNull()),
        },
      });

  for (const song of songs) {
    const label = `${game.key}/${season.dalcomSeasonId}/${song.internalSongId}/${song.album}/${song.name}`;
    responseText.push(`Fetching ${label}`);
    const endpoint = buildUrl(song.internalSongId);
    const resp = await got(endpoint).catch((e) => {
      if (e instanceof HTTPError && e.response.statusCode === 403) {
        responseText.push(`[SKIP] Song has no WR`);
        return 'skip';
      }
      console.error(endpoint, e);
      responseText.push(`[ERROR] Song had error ${label}`);
      responseText.push(`URL: ${endpoint}`);
      if (e instanceof Error) {
        responseText.push(`  [${e.name}] ${e.message}`);
        responseText.push(e.stack);
      } else {
        responseText.push(e);
      }
    });
    if (typeof resp === 'string') {
      continue;
    }
    if (!resp) {
      const errStr = `Song ${song.internalSongId} had no response. Error?`;
      console.error(errStr);
      responseText.push(errStr);
      continue;
    }
    if (!resp.body) {
      const errStr = `Song ${song.internalSongId} Empty body?`;
      console.error(errStr);
      responseText.push(errStr);
      continue;
    }

    const rankingData: WRRecordEntry[] = JSON.parse(resp.body);
    writeRankingDataToCache(
      game,
      song,
      season.dalcomSeasonId,
      rankingData,
      new Date(),
      source,
      SongWorldRecordArchives,
    );

    const result = await parseRankingData(
      rankingData,
      game,
      song,
      season,
      SongWorldRecords,
      new Date(),
    );
    let entries: SongWorldRecord[] = [];
    const output = result?.dots?.join('') || '';
    if (result.result === 'ok' && result.entries?.length) {
      entries = result.entries;
    } else if (result.result === 'ok') {
      responseText.push('  No changes - Done!');
      continue;
    } else {
      continue;
    }

    if (verbose) {
      entries.forEach((wr) =>
        responseText.push(
          `  [INFO] inserting ${game.key}/${song.album}/${
            song.name
          }[${wr.rank.toLocaleString('en', {
            minimumIntegerDigits: 3,
            useGrouping: false,
          })}] - ${wr.nickname} - ${wr.highscore} \t\t- ${wr.dateRecorded}`,
        ),
      );
    } else {
      responseText.push('  ' + output);
    }
    const saved = await SongWorldRecords.save(entries);

    responseText.push(`Done! +${saved.length}`);
  }

  return {
    responseText,
  };
}

export function buildUrlRanking(endpoint: string, bonusSystem: WRSeasonType) {
  const filename = bonusSystem.startsWith('top100') ? 'latest' : 'latest_first';
  return (dcSeasonId: number, dcSongId: NumberLike) =>
    `${endpoint}${dcSeasonId}/${dcSongId}/${filename}.json?t=${Date.now()}`;
}

export async function writeRankingDataToCache(
  game: SuperstarGame,
  song: Song,
  seasonCode: number,
  contents: object,
  dateObserved = new Date(),
  source = 'manual',
  SongWorldRecordArchives = getRepository(SongWorldRecordArchive),
) {
  const fingerprint = createFingerprint('sha256', JSON.stringify(contents));

  const songCode = parseInt(song.internalSongId, 10);
  if (isNaN(songCode)) {
    throw new Error(
      `Song ${song.name} (${game.key}) has an invalid song code.`,
    );
  }

  const existingArchiveItem = await SongWorldRecordArchives.count({
    where: {
      gameId: game.id,
      fingerprint,
    },
  });

  if (existingArchiveItem) {
    return;
  }

  const archiveItem = SongWorldRecordArchives.create({
    gameId: game.id,
    data: contents,
    dateEntry: new Date(),
    guid: generate_guid(),
    source,
    songCode,
    seasonCode,
    dateObserved,
    fingerprint,
  });

  return SongWorldRecordArchives.save(archiveItem);
}

export async function parseRankingData(
  rankingData: WRRecordEntry[],
  game: SuperstarGame,
  song: Song,
  season?: WorldRecordSeason,
  SongWorldRecords = getRepository(SongWorldRecord),
  dateObserved = new Date(),
  WorldRecordSeasons?: Repository<WorldRecordSeason>,
) {
  if (!rankingData?.length || !rankingData[0]) {
    console.error(
      `[ERROR] Song with dalcom ID '${song.internalSongId} - ${game.key}' had an error - no ranking data?.`,
    );
    return { result: 'no data' };
  }

  if (!season) {
    const WorldRecordSeasons = getRepository(WorldRecordSeason);
    const seasonDate = new Date(rankingData[0].updatedAt);
    season = await WorldRecordSeasons.createQueryBuilder('season')
      // .cache(true)
      .where('dateStart < :date', { date: seasonDate })
      .andWhere('dateEnd > :date', { date: seasonDate })
      .innerJoin('season.game', 'game')
      .andWhere('game.key = :gameKey', { gameKey: game.key })
      .getOne();
    if (!season) {
      console.error(
        `[ERROR] Song with dalcom ID '${song.internalSongId} - ${game.key}' had an error - no WR season found.`,
      );
      return { result: 'error' };
    }
  }

  const wrRankingLength = rankingData.length;
  const entries: SongWorldRecord[] = [];
  const dots: string[] = [];
  for (let index = 0; index < wrRankingLength; index++) {
    const ranking = rankingData[index];

    const wr = SongWorldRecords.create(ranking as {});
    wr.songId = song.id;
    wr.meta = JSON.stringify({});
    wr.specialUserCode = wr.specialUserCode || 0;
    wr.guid = generate_guid();
    wr.rank = index + 1;

    wr.dateRecorded = new Date(ranking.updatedAt);
    wr.dateObserved = dateObserved;
    wr.dateEntry = new Date();

    const leaderCard = ranking.leaderCard;
    if (leaderCard) {
      wr.leaderCard = {
        cardImage: leaderCard.c,
        grade: dalcomGradeMap[leaderCard.g],
        level: leaderCard.l,
      };
    }
    wr.season = season;

    // Find out if it's already been inserted
    const existsQuery = SongWorldRecords.createQueryBuilder('wr')
      .cache(false)
      .innerJoin('wr.song', 'song')
      .innerJoin('song.game', 'game')
      .where('song_id = :songId', { songId: song.id })
      .andWhere('object_id = :objectId', { objectId: wr.objectID })
      .andWhere('date_recorded = :dateRecorded', {
        dateRecorded: wr.dateRecorded,
      })
      .andWhere('game.key = :gameKey', { gameKey: game.key })
      .andWhere('season_id = :seasonId', { seasonId: season.id });
    if (wr.rank === 1) {
      existsQuery.andWhere('rank = :rank', { rank: wr.rank });
    }
    const exists = (await existsQuery.getCount()) > 0;
    if (exists) {
      dots.push('S');
      continue;
    }

    entries.push(wr);
    dots.push('.');
  }

  return {
    result: 'ok',
    entries,
    dots,
  };
}
