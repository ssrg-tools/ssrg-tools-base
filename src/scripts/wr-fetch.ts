import { Song } from '../entity/Song';
import { SuperstarGame } from '../entity/SuperstarGame';
import { NumberLike } from '../types';
import { createConnection, getRepository } from 'typeorm';
import got from 'got';
import { WorldRecordSeason } from '../entity/WorldRecordSeason';
import { WRRecordEntry } from '../dalcom';
import { SongWorldRecord } from '../entity/SongWorldRecord';
import moment from 'moment';
import { parseRankingData } from '../wr';
import { writeRankingDataToCache } from './wr-common';

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

      writeRankingDataToCache(gameKey, seasonId, timestamp, song, resp.body);

      const rankingData: WRRecordEntry[] = JSON.parse(resp.body);
      const result = await parseRankingData(
        rankingData,
        game,
        song,
        getRepository(WorldRecordSeason),
        SongWorldRecords,
      );
      let entries: SongWorldRecord[] = [];
      const output = result?.dots?.join('') || '';
      if (result.result === 'ok' && result.entries?.length) {
        entries = result.entries;
      } else if (result.result === 'ok') {
        console.log('  No changes - Done!');
        continue;
      } else {
        continue;
      }

      if (verbose) {
        entries.forEach(wr => console.log(`  [INFO] inserting ${game.key}/${song.album}/${song.name}[${wr.rank.toLocaleString('en', { minimumIntegerDigits: 3, useGrouping: false })}] - ${wr.nickname} - ${wr.highscore} \t\t- ${wr.dateRecorded}`));
      } else {
        process.stdout.write('  ' + output);
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