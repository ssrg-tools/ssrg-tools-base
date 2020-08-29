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

const verbose = false;

createConnection().then(async connection => {
  const Songs = getRepository(Song);
  const SongWorldRecords = getRepository(SongWorldRecord);

  const games = _.keyBy(await getRepository(SuperstarGame).find(), 'id');
  const apkMap = _.keyBy(games, 'apkName');

  const songsByGames = _.mapValues(_.groupBy(await Songs.find({
    select: ['id', 'internalSongId', 'gameId', 'name', 'album'],
    where: 'dalcom_song_id IS NOT NULL'
  }), 'gameId'), songs => _.keyBy(songs, 'internalSongId'));

  const inputPaths = process.argv.slice(2);
  if (inputPaths.length === 0) {
    console.error(`No input provided.`);
    process.exit(1);
  }

  const wrFolders: string[] = [];
  const worldRecords: SongWorldRecord[] = [];
  let skipped = 0;

  await Promise.all(inputPaths.map(async inputPath => {
    if (!fs.existsSync(inputPath) || !(await fs.promises.lstat(inputPath)).isDirectory()) {
      console.error(`Path ${inputPath} does not exist or is not a directory.`);
      process.exit(1);
    }
  }));

  await Promise.all(inputPaths.map(async inputPath => {
    const files = await fs.promises.readdir(inputPath);
    await Promise.all(files.map(async file => {
      const filepath = path.join(inputPath, file);
      const isDir = (await fs.promises.lstat(filepath)).isDirectory();
      const isWr = /^wr-|^(133928|9865992|674379|245395|16680625)$/.test(file);

      if (isDir && isWr) {
        wrFolders.push(filepath);
      }
    }));
  }));

  await Promise.all(wrFolders.map(async wrFolder => {
    const files = await fs.promises.readdir(wrFolder);
    await Promise.all(files.map(async file => {
      if (!/\.json$/.test(file)) {
        return;
      }
      const relpath = path.join(wrFolder, file);
      const filepath = path.resolve(relpath);

      const pathparts = filepath.split(path.sep);
      const dalcomfoldername = pathparts.find(part => part.match('dalcomsoft'));
      const game = apkMap[dalcomfoldername];

      if (!game) {
        console.error(`[ERROR] Could not find game for ${relpath} (${dalcomfoldername})`);
        console.error(apkMap);
        return;
      }

      const songsForGame = songsByGames[game.id];
      if (!songsForGame) {
        console.error(`[ERROR] Could not find songs for game ${game.name} (${filepath})`);
        return;
      }

      // console.log(`Processing '${filepath}'`);
      const dalcomWR: WRRecord = require(filepath);
      const mentionedSong = songsByGames[game.id][dalcomWR.code];

      if (!mentionedSong) {
        console.error(`[ERROR] Song with dalcom ID '${dalcomWR.code} - ${game.key}' was not found.`);
        return;
      }

      const wr = SongWorldRecords.create(dalcomWR.rankDataRaw.ranking[0] as {});
      wr.songId = mentionedSong.id;
      wr.meta = JSON.stringify({ path: relpath });
      wr.specialUserCode = wr.specialUserCode || 0;

      if (!dalcomWR.rankDataRaw.ranking || !dalcomWR.rankDataRaw.ranking[0]) {
        console.error(`[ERROR] Song with dalcom ID '${dalcomWR.code} - ${game.key}' had an error - no ranking data?. ${filepath}`);
        return;
      }

      wr.dateRecorded = new Date(dalcomWR.rankDataRaw.ranking[0].updatedAt);

      // Find out if it's already been inserted
      const exists = (await SongWorldRecords.createQueryBuilder('wr')
        .cache(false)
        .innerJoin('wr.song', 'song')
        .innerJoin('song.game', 'game')
        .where('song_id = :songId', { songId: mentionedSong.id })
        .andWhere('object_id = :objectId', { objectId: wr.objectID })
        .andWhere('date_recorded = :dateRecorded', { dateRecorded: wr.dateRecorded })
        .andWhere('game.key = :gameKey', { gameKey: game.key })
        .getCount()) > 0;
      if (exists) {
        if (verbose) {
          console.warn(`Record '${relpath}' already inserted.`);
        }
        skipped++;
        return;
      }

      const leaderCard = dalcomWR.rankDataRaw.ranking[0].leaderCard;
      if (leaderCard) {
        wr.leaderCard = {
          cardImage: leaderCard.c,
          grade: dalcomGradeMap[leaderCard.g],
          level: leaderCard.l,
        };
      }

      const season = await getRepository(WorldRecordSeason)
        .createQueryBuilder('season')
        .cache(true)
        .where('dateStart < NOW()')
        .andWhere('dateEnd > NOW()')
        .innerJoin('season.game', 'game')
        .andWhere('game.key = :gameKey', { gameKey: game.key })
        .getOne()
        ;
      wr.season = season;
      if (!season) {
        console.error(`[ERROR] Song with dalcom ID '${dalcomWR.code} - ${game.key}' had an error - no WR season found. ${filepath}`);
        return;
      }
      // console.log(dalcomWR, wr);
      worldRecords.push(wr);
      // await SongWorldRecords.save(wr);
      console.log(`[INFO] inserting ${game.key}/${mentionedSong.album}/${mentionedSong.name} - ${wr.nickname} - ${wr.highscore} \t\t- ${wr.dateRecorded}`);
    }));
  }));

  // De-duplicate new entries
  const deduplicated = _.uniqBy(worldRecords, wr => {
    return JSON.stringify({
      songId: wr.songId,
      objectID: wr.objectID,
      highscore: wr.highscore,
      dateRecorded: wr.dateRecorded,
    });
  });

  // console.log(wrFolders, worldRecords.length);
  const saved = await SongWorldRecords.save(deduplicated);
  console.log(`Done, inserted ${saved.length} entries and skipped ${skipped}.`);
}).then(() => process.exit(0)).catch((reason) => {
  console.error(reason);
  process.abort();
});
