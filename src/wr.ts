import { Repository } from 'typeorm';
import { dalcomGradeMap, WRRecordEntry } from './dalcom';
import { Song } from './entity/Song';
import { SongWorldRecord } from './entity/SongWorldRecord';
import { SuperstarGame } from './entity/SuperstarGame';
import { WorldRecordSeason } from './entity/WorldRecordSeason';
import { generate_guid } from './guid';

export async function parseRankingData(
  rankingData: WRRecordEntry[],
  game: SuperstarGame,
  song: Song,
  WorldRecordSeasons: Repository<WorldRecordSeason>,
  SongWorldRecords: Repository<SongWorldRecord>,
) {
  if (!rankingData?.length || !rankingData[0]) {
    console.error(`[ERROR] Song with dalcom ID '${song.internalSongId} - ${game.key}' had an error - no ranking data?.`);
    return { result: 'no data' };
  }

  const seasonDate = new Date(rankingData[0].updatedAt);
  const season = await WorldRecordSeasons
    .createQueryBuilder('season')
    // .cache(true)
    .where('dateStart < :date', { date: seasonDate })
    .andWhere('dateEnd > :date', { date: seasonDate })
    .innerJoin('season.game', 'game')
    .andWhere('game.key = :gameKey', { gameKey: game.key })
    .getOne()
    ;
  if (!season) {
    console.error(`[ERROR] Song with dalcom ID '${song.internalSongId} - ${game.key}' had an error - no WR season found.`);
    return { result: 'error' };
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
      .andWhere('date_recorded = :dateRecorded', { dateRecorded: wr.dateRecorded })
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
