import * as fs from 'fs';
import * as path from 'path';

import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';
import { Song } from '../entity/Song';
import { SongWorldRecord } from '../entity/SongWorldRecord';
import { WRRecord, dalcomGradeMap } from '../dalcom';
import { LoDashStatic } from 'lodash';

createConnection().then(async connection => {
  const _: LoDashStatic = require('lodash');
  const Songs = getRepository(Song);
  const SongWorldRecords = getRepository(SongWorldRecord);

  const songsByCode = _.keyBy(await Songs.find({
    select: ['id', 'internalSongId'],
    where: 'dalcom_song_id IS NOT NULL'
  }), 'internalSongId');

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
      const isWr = /^wr-/.test(file);

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
      console.log(`Processing '${filepath}'`);
      const dalcomWR: WRRecord = require(filepath);
      const mentionedSong = songsByCode[dalcomWR.code];

      if (!mentionedSong) {
        console.error(`[ERROR] Song with dalcom ID '${dalcomWR.code}' was not found.`);
      }

      // Find out if it's already been inserted
      const exists = (await SongWorldRecords.createQueryBuilder('wr')
        .where('song_id = :songId', { songId: mentionedSong.id })
        .andWhere('JSON_VALUE(`meta`, \'$.path\') = :relpath', { relpath })
        .getCount()) > 0;
      if (exists) {
        console.warn(`Record '${relpath}' already inserted.`);
        skipped++;
        return;
      }

      const wr = SongWorldRecords.create(dalcomWR.rankDataRaw.ranking[0] as {});
      wr.songId = mentionedSong.id;
      wr.meta = JSON.stringify({ path: relpath });

      wr.dateRecorded = new Date(dalcomWR.rankDataRaw.ranking[0].updatedAt);

      const leaderCard = dalcomWR.rankDataRaw.ranking[0].leaderCard;
      if (leaderCard) {
        wr.leaderCard = {
          cardImage: leaderCard.c,
          grade: dalcomGradeMap[leaderCard.g],
          level: leaderCard.l,
        };
      }
      // console.log(dalcomWR, wr);
      worldRecords.push(wr);
      // await SongWorldRecords.save(wr);
    }));
  }));

  console.log(wrFolders, worldRecords.length);
  const saved = await SongWorldRecords.save(worldRecords);
  console.log(`Done, inserted ${saved.length} entries and skipped ${skipped}.`);
}).then(() => process.exit(0)).catch((reason) => {
  console.error(reason);
  process.abort();
});
