import { Song } from '../entity/Song';
import { SuperstarGame } from '../entity/SuperstarGame';
import { createConnection, getRepository } from 'typeorm';
import got from 'got';
import { WorldRecordSeason } from '../entity/WorldRecordSeason';
import { WRRecordEntry } from '../dalcom';
import { SongWorldRecord } from '../entity/SongWorldRecord';
import moment from 'moment';
import { buildUrlRanking, parseRankingData, writeRankingDataToCache } from '../wr';

const verbose = false;

const currentSeason = {
  jyp: 7,
  sm: 6,
};

const inputGameKey = process.argv[2];
if (!inputGameKey) {
  console.error('No gameKey provided.');
  process.exit(1);
}
const inputDalcomSeasonId = process.argv[3] || currentSeason[inputGameKey];

const timeStart = new Date();

createConnection()
  .then(async () => {
    const Games = getRepository(SuperstarGame);
    const Songs = getRepository(Song);
    const SongWorldRecords = getRepository(SongWorldRecord);

    const totalInserted = 0;
    const totalSkipped = 0;

    const promises$: Promise<any>[] = [];

    const fetchWRsForGame = async (gameKey: string, seasonId: number) => {
      const game = await Games.findOneOrFail(null, {
        where: { key: gameKey },
        select: ['id', 'key', 'baseUrlRanking'],
      });

      if (!game.baseUrlRanking) {
        console.error(`gameKey '${gameKey}' not supported.`);
        process.exit(1);
      }

      const season = await getRepository(WorldRecordSeason).findOneOrFail(null, {
        where: { dalcomSeasonId: seasonId },
      });
      const buildUrl = buildUrlRanking(game.baseUrlRanking, season.bonusSystem);

      const songs = await Songs.find({ where: { gameId: game.id } });
      for (const song of songs) {
        console.log(`Fetching ${gameKey}/${seasonId}/${song.internalSongId}/${song.album}/${song.name}`);
        const endpoint = buildUrl(seasonId, song.internalSongId);
        const resp = await got(endpoint).catch(e => {
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

        const rankingData: WRRecordEntry[] = JSON.parse(resp.body);
        promises$.push(writeRankingDataToCache(game, song, seasonId, rankingData, new Date(), 'script/wr-fetch'));

        const result = await parseRankingData(rankingData, game, song, season, SongWorldRecords, new Date());
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
          entries.forEach(wr =>
            console.log(
              `  [INFO] inserting ${game.key}/${song.album}/${song.name}[${wr.rank.toLocaleString('en', {
                minimumIntegerDigits: 3,
                useGrouping: false,
              })}] - ${wr.nickname} - ${wr.highscore} \t\t- ${wr.dateRecorded}`,
            ),
          );
        } else {
          process.stdout.write('  ' + output);
        }
        const saved = await SongWorldRecords.save(entries);

        process.stdout.write(` Done! +${saved.length}\n`);
      }
    };

    await fetchWRsForGame(inputGameKey, inputDalcomSeasonId);
    console.log(`Nearly done, waiting for cache to finish writing.`);
    await Promise.all(promises$);

    const timeEnd = new Date();
    const timeTaken = Math.round(moment(timeEnd).diff(moment(timeStart)) / 1000);
    const timeTakenH = timeTaken / 60 / 60;

    console.log(`Processed in ${timeTaken}s (${timeTakenH}h)`);
    console.log(`Inserted ${totalInserted} and skipped ${totalSkipped}.`);
  })
  .then(() => process.exit(0))
  .catch(reason => {
    console.error(reason);
    process.abort();
  });
