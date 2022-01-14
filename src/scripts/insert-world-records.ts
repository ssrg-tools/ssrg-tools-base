import * as fs from 'fs';
import * as path from 'path';

import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';
import { Song } from '../entity/Song';
import { SongWorldRecord } from '../entity/SongWorldRecord';
import { WRRecord, dalcomGradeMap } from '../dalcom';
import _ from 'lodash';
import { SuperstarGame } from '../entity/SuperstarGame';
import { WorldRecordSeason } from '../entity/WorldRecordSeason';
import { generate_guid } from '../guid';
import { writeRankingDataToCache } from '../wr';

const verbose = false;
const stubSongs = false;

createConnection()
  .then(async () => {
    const Songs = getRepository(Song);
    const SongWorldRecords = getRepository(SongWorldRecord);

    const games = _.keyBy(await getRepository(SuperstarGame).find(), 'id');
    const apkMap = _.keyBy(games, 'apkName');

    const songs = await Songs.find({
      select: ['id', 'internalSongId', 'gameId', 'name', 'album'],
      where: 'dalcom_song_id IS NOT NULL',
    });
    const songsByGames = _.mapValues(
      _.groupBy(songs, 'gameId'),
      (songsToSort) => _.keyBy(songsToSort, 'internalSongId'),
    );
    const songsByID = _.keyBy(songs, 'id');

    const inputPaths = process.argv.slice(2);
    if (inputPaths.length === 0) {
      console.error(`No input provided.`);
      process.exit(1);
    }

    const wrFolders: string[] = [];
    const worldRecords: SongWorldRecord[] = [];
    let skipped = 0;

    await Promise.all(
      inputPaths.map(async (inputPath) => {
        if (
          !fs.existsSync(inputPath) ||
          !(await fs.promises.lstat(inputPath)).isDirectory()
        ) {
          console.error(
            `Path ${inputPath} does not exist or is not a directory.`,
          );
          process.exit(1);
        }
      }),
    );

    await Promise.all(
      inputPaths.map(async (inputPath) => {
        const files = await fs.promises.readdir(inputPath);
        await Promise.all(
          files.map(async (file) => {
            const filepath = path.join(inputPath, file);
            const isDir = (await fs.promises.lstat(filepath)).isDirectory();
            const isWr = /^wr-|^(133928|9865992|674379|245395|16680625|120908)$/.test(
              file,
            );

            if (isDir && isWr) {
              wrFolders.push(filepath);
            }
          }),
        );
      }),
    );

    await Promise.all(
      wrFolders.map(async (wrFolder) => {
        const files = await fs.promises.readdir(wrFolder);
        await Promise.all(
          files.map(async (file) => {
            if (!/\.json$/.test(file)) {
              return;
            }
            const relpath = path.join(wrFolder, file);
            const filepath = path.resolve(relpath);

            const pathparts = filepath.split(path.sep);
            const dalcomfoldername = pathparts.find((part) =>
              part.match('dalcomsoft'),
            );
            const game = apkMap[dalcomfoldername];

            if (!game) {
              console.error(
                `[ERROR] Could not find game for ${relpath} (${dalcomfoldername})`,
              );
              console.error(apkMap);
              return;
            }

            const songsForGame = songsByGames[game.id];
            if (!songsForGame) {
              console.error(
                `[ERROR] Could not find songs for game ${game.name} (${filepath})`,
              );
              return;
            }

            // console.log(`Processing '${filepath}'`);
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const dalcomWR: WRRecord = require(filepath);
            let mentionedSong = songsForGame[dalcomWR.code];

            const fsHandle = fs.openSync(filepath, 'r');
            const wrFileInfo = fs.fstatSync(fsHandle);
            const dateObserved = new Date(wrFileInfo.mtimeMs);
            fs.closeSync(fsHandle);

            if (!stubSongs && !mentionedSong) {
              console.error(
                `[ERROR] Song with dalcom ID '${dalcomWR.code} - ${game.key}' was not found.`,
              );
              return;
            } else if (stubSongs && !mentionedSong) {
              mentionedSong = await Songs.save(
                Songs.create({
                  name: `${game.key.toLocaleUpperCase()} song #${
                    dalcomWR.code
                  }`,
                  album: `${game.key.toLocaleUpperCase()} song #${
                    dalcomWR.code
                  }`,
                  ingame: 0,
                  imageId: dalcomWR.code.toString(),
                  internalSongId: dalcomWR.code.toString(),
                  guid: generate_guid(),
                  game,
                }),
              );
              console.warn(
                `[WARN] Created stub song for dalcom ID '${dalcomWR.code} - ${game.key}'`,
              );
            }

            const wrRankingLength = dalcomWR.rankDataRaw.ranking.length;
            if (
              !dalcomWR.rankDataRaw.ranking ||
              !dalcomWR.rankDataRaw.ranking[0]
            ) {
              console.error(
                `[ERROR] Song with dalcom ID '${dalcomWR.code} - ${game.key}' had an error - no ranking data?. ${filepath}`,
              );
              return;
            }

            const seasonDate = new Date(
              dalcomWR.rankDataRaw.ranking[0].updatedAt,
            );
            const season = await getRepository(WorldRecordSeason)
              .createQueryBuilder('season')
              .cache(true)
              .where('dateStart < :date', { date: seasonDate })
              .andWhere('dateEnd > :date', { date: seasonDate })
              .innerJoin('season.game', 'game')
              .andWhere('game.key = :gameKey', { gameKey: game.key })
              .getOne();
            if (!season.dalcomSeasonId) {
              console.error(
                `[ERROR] Song with dalcom ID '${dalcomWR.code} - ${game.key}' had an error - season does not have dalcom code. ${filepath}`,
              );
              return;
            }

            writeRankingDataToCache(
              game,
              mentionedSong,
              season.dalcomSeasonId,
              dalcomWR.rankDataRaw.ranking,
              dateObserved,
              'manual',
            );

            for (let index = 0; index < wrRankingLength; index++) {
              const ranking = dalcomWR.rankDataRaw.ranking[index];

              // eslint-disable-next-line @typescript-eslint/ban-types
              const wr = SongWorldRecords.create(ranking as {});
              wr.songId = mentionedSong.id;
              wr.meta = JSON.stringify({});
              wr.specialUserCode = wr.specialUserCode || 0;
              wr.guid = generate_guid();
              wr.rank = index + 1;

              wr.dateRecorded = new Date(ranking.updatedAt);
              wr.dateObserved = dateObserved;
              wr.dateEntry = new Date();

              // Find out if it's already been inserted
              const existsQuery = SongWorldRecords.createQueryBuilder('wr')
                .cache(false)
                .innerJoin('wr.song', 'song')
                .innerJoin('song.game', 'game')
                .where('song_id = :songId', { songId: mentionedSong.id })
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
                if (verbose) {
                  console.warn(`Record '${relpath}' already inserted.`);
                }
                skipped++;
                continue;
              }

              const leaderCard = ranking.leaderCard;
              if (leaderCard) {
                wr.leaderCard = {
                  cardImage: leaderCard.c,
                  grade: dalcomGradeMap[leaderCard.g],
                  level: leaderCard.l,
                };
              }

              wr.season = season;
              if (!season) {
                console.error(
                  `[ERROR] Song with dalcom ID '${dalcomWR.code} - ${game.key}' had an error - no WR season found. ${filepath}`,
                );
                continue;
              }
              worldRecords.push(wr);
              console.log(
                `[INFO] inserting ${game.key}/${mentionedSong.album}/${
                  mentionedSong.name
                }[${wr.rank.toLocaleString('en', {
                  minimumIntegerDigits: 3,
                  useGrouping: false,
                })}] - ${wr.nickname} - ${wr.highscore} \t\t- ${
                  wr.dateRecorded
                }`,
              );
            }
          }),
        );
      }),
    );

    // De-duplicate new entries
    const deduplicated = _.uniqBy(worldRecords, (wr) => {
      return JSON.stringify({
        songId: wr.songId,
        objectID: wr.objectID,
        highscore: wr.highscore,
        dateRecorded: wr.dateRecorded,
        rank: wr.rank,
      });
    });
    // console.log(`Done ${deduplicated.length}`);
    // process.exit();
    // console.log(wrFolders, worldRecords.length);
    const saved = await SongWorldRecords.save(deduplicated);
    console.log(
      `Done, inserted ${saved.length} entries and skipped ${skipped}.`,
    );
    console.log(
      _.mapKeys(
        _.mapValues(
          _.groupBy(saved, (swr) => songsByID[swr.songId]?.gameId),
          (group) => group.length,
        ),
        (group, key) =>
          games[key]?.name || `Unknown Game #${key} (${group} values)`,
      ),
    );
  })
  .then(() => process.exit(0))
  .catch((reason) => {
    console.error(reason);
    process.abort();
  });
