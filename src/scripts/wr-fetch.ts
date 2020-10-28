import { Song } from '../entity/Song';
import { SuperstarGame } from '../entity/SuperstarGame';
import { NumberLike } from '../types';
import { createConnection, getRepository } from 'typeorm';
import got from 'got';
import { WorldRecordSeason } from '../entity/WorldRecordSeason';
import { dalcomGradeMap, WRRecordEntry } from '../dalcom';
import { SongWorldRecord } from '../entity/SongWorldRecord';
import { generate_guid } from '../guid';
import moment from 'moment';
import fs from 'fs';
import path from 'path';

const verbose = false;

const map = {
  jyp(dcSeasonId: number, dcSongId: NumberLike) {
    return `https://superstar-jyp.s3.ap-northeast-2.amazonaws.com/world_record_ranking/production/${dcSeasonId}/${dcSongId}/latest.json?t=${Math.floor(new Date().getTime() / 100)}`;
  },
  sm(dcSeasonId: number, dcSongId: NumberLike) {
    return `https://superstar-smtown-live.s3.ap-northeast-2.amazonaws.com/world_record_ranking/production/${dcSeasonId}/${dcSongId}/latest.json?t=${Math.floor(new Date().getTime() / 100)}`;
  },
};

const supportsWR = [
  'jyp',
  'sm',
  // 'starhip',
  // 'woollim',
  // 'gfriend',
];

const currentSeason = {
  jyp: 7,
  sm: 6,
};

const inputGameKey = process.argv[2];
if (!inputGameKey) {
  console.error('No gameKey provided.');
  process.exit(1);
}
if (!supportsWR.includes(inputGameKey)) {
  console.error(`gameKey '${inputGameKey}' not supported. Only ${supportsWR}.`);
  process.exit(1);
}
const inputDalcomSeasonId = process.argv[3] || currentSeason[inputGameKey];

const timeStart = new Date();

createConnection().then(async conn => {
  const Games = getRepository(SuperstarGame);
  const Songs = getRepository(Song);
  const SongWorldRecords = getRepository(SongWorldRecord);

  let totalInserted = 0;
  let totalSkipped = 0;

  const fetchWRsForGame = async (gameKey: string, seasonId: number) => {
    const game = await Games.findOneOrFail(null, { where: { key: gameKey } });
    const songs = await Songs.find({ where: { gameId: game.id } });
    const timestamp = moment().format('YYYY-MM-DD_HH-mm');
    for (const song of songs) {
      console.log(`Fetching ${gameKey}/${seasonId}/${song.internalSongId}/${song.album}/${song.name}`);
      const endpoint = map[gameKey](seasonId, song.internalSongId);
      const resp = await got(endpoint)
        .catch((e) => {
          console.error(endpoint, e);
        });
      if (!resp) {
        console.error(`Song ${song.internalSongId} had no response. Error?`);
        continue;
      }
      if (!resp.body) {
        console.error(`Song ${song.internalSongId} Empty body?`);
        continue;
      }

      const dir = path.join(
        __dirname,
        '..', '..', '..',
        'assets',
        'wr-cache',
        gameKey,
        `${seasonId}_${timestamp}`
      );
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFile(path.join(dir, song.internalSongId + '.json'), resp.body, 'utf8', (err) => {
        if (err) {
            console.log('An error occured while writing JSON Object to File.');
            return console.log(err);
        }

        console.log('JSON file has been saved.');
      });
      const rankingData: WRRecordEntry[] = JSON.parse(resp.body);

      if (!rankingData?.length || !rankingData[0]) {
        console.error(`[ERROR] Song with dalcom ID '${song.internalSongId} - ${game.key}' had an error - no ranking data?.`);
        continue;
      }

      const seasonDate = new Date(rankingData[0].updatedAt);
      const season = await getRepository(WorldRecordSeason)
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
        continue;
      }

      const wrRankingLength = rankingData.length;
      const entries: SongWorldRecord[] = [];
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
          totalSkipped++;
          process.stdout.write('S');
          continue;
        }
        totalInserted++;

        if (verbose) {
          console.log(`[INFO] inserting ${game.key}/${song.album}/${song.name}[${wr.rank.toLocaleString('en', { minimumIntegerDigits: 3, useGrouping: false })}] - ${wr.nickname} - ${wr.highscore} \t\t- ${wr.dateRecorded}`);
        } else {
          process.stdout.write('.');
        }
        entries.push(wr);
      }
      const saved = await SongWorldRecords.save(entries);

      process.stdout.write(` Done! +${saved.length}\n`);
    }
  };

  await fetchWRsForGame(inputGameKey, inputDalcomSeasonId);

  const timeEnd = new Date();
  const timeTaken = Math.round(moment(timeEnd).diff(moment(timeStart)) / 1000);
  const timeTakenH = timeTaken / 60 / 60;

  console.log(`Processed in ${timeTaken}s (${timeTakenH}h)`);
  console.log(`Inserted ${totalInserted} and skipped ${totalSkipped}.`);
}).then(() => process.exit(0)).catch((reason) => {
  console.error(reason);
  process.abort();
});
