import path from 'path';
import fs from 'fs';
import { createConnection, getRepository } from 'typeorm';
import csvParser from 'csv-parse/lib/sync';
import moment from 'moment';
import { LeagueTrackerEntry } from '../entity/LeagueTrackerEntry';
import { generate_guid } from '../guid';
import { SuperstarGame } from '../entity/SuperstarGame';
import { SongWorldRecord } from '../entity/SongWorldRecord';
import { Dictionary } from 'lodash';

createConnection().then(async connection => {
  if (!process.argv[2] && !process.argv[3]) {
    console.error(`No args provided. Need gameKey and source file.`);
    process.exit(1);
  }
  const gameKey = process.argv[2];
  if (!gameKey) {
    console.error(`No gameKey provided.`);
    process.exit(1);
  }
  if (/[/\/]/.test(gameKey)) {
    console.error(`gameKey had slashes. Was it intended as the source file parameter?`);
    process.exit(1);
  }
  const leagueDataFilePath = path.resolve(process.argv[3]);
  if (!fs.existsSync(leagueDataFilePath)) {
    console.error(`File ${leagueDataFilePath} does not exist.`);
    process.exit(1);
  }

  const game = await getRepository(SuperstarGame).findOne(undefined, { where: { key: gameKey } });
  if (!game) {
    console.error(`Game '${gameKey}' not found.`);
    process.exit(1);
  }

  const LeagueTrackerEntries = getRepository(LeagueTrackerEntry);
  const SongWorldRecords = getRepository(SongWorldRecord);
  const settings: Dictionary<{
    skipLines: number,
    readEntry: (record: string[]) => LeagueTrackerEntry | 'skip',
  }> = {
    gfriend: {
      skipLines: 1,
      readEntry(record) {
        const nickname = record[2];
        const date = moment(record[4] + ' 17:00:00+00:00', 'MM/DD/YYYY HH:mm:ssZ').toDate();
        const leagueTrackerEntry = LeagueTrackerEntries.create({
          nickname,
          score: parseInt((record[3] || '').replace(/[,.]/g, ''), 10),
          divisionGroup: parseInt(record[1], 10),
          isSSRGDiscord: record[5] ? 1 : 0,
          date,
          game,
          guid: generate_guid(),
        });
        return leagueTrackerEntry;
      },
    },
    jyp: {
      skipLines: 1,
      readEntry(record) {
        const date = moment(record[2] + ' 17:00:00+00:00', 'MM/DD/YYYY HH:mm:ssZ').toDate();
        const leagueTrackerEntry = LeagueTrackerEntries.create({
          nickname: record[0],
          score: parseInt((record[1] || '').replace(/[,.]/g, ''), 10),
          divisionGroup: 3, // SCD's sheets don't have value for group
          isSSRGDiscord: record[4] ? 1 : 0,
          date,
          game,
          guid: generate_guid(),
        });
        return leagueTrackerEntry;
      },
    },
    starship: {
      skipLines: 5,
      readEntry(record) {
        const date = moment(record[5] + ' 17:00:00+00:00', 'DD/MM/YYYY HH:mm:ssZ').toDate();
        const divisionGroup = /\bComet\b/.test(leagueDataFilePath) ? 1 : 2;
        const score = parseInt((record[4] || '').replace(/[,.]/g, ''), 10);
        if (score === 0) {
          return 'skip';
        }
        const leagueTrackerEntry = LeagueTrackerEntries.create({
          nickname: record[1],
          score,
          divisionGroup,
          isSSRGDiscord: record[6] ? 1 : 0,
          date,
          game,
          guid: generate_guid(),
        });
        return leagueTrackerEntry;
      },
    },
  };

  if (!settings[gameKey]) {
    console.error(`Game '${gameKey}' not supported!`);
    process.exit(1);
  }

  const contents = fs.readFileSync(leagueDataFilePath, 'utf8');
  const records: any[] = csvParser(contents, {
    // columns: true,
    skip_empty_lines: true
  }).slice(settings[gameKey].skipLines);

  if (!records.length) {
    console.error(`File '${leagueDataFilePath}' has no records.`);
    process.exit(1);
  }


  console.log(`Processing '${records.length}' records!`);

  let inserted = 0;
  let skipped = 0;

  for (const record of records) {
    if (!record[1] || (gameKey === 'starship' ? !record[4] : !record[2])) {
      process.stdout.write('X');
      continue;
    }

    const leagueTrackerEntry = settings[gameKey].readEntry(record);
    if (!leagueTrackerEntry) {
      console.error(`Error for record`, record);
      process.exit(1);
    }
    if (leagueTrackerEntry === 'skip') {
      process.stdout.write('Z');
      continue;
    }

    const existing = await LeagueTrackerEntries.findOne(undefined, {
      where: {
        date: leagueTrackerEntry.date,
        nickname: leagueTrackerEntry.nickname,
        gameId: game.id,
      },
    });
    if (existing) {
      skipped++;
      process.stdout.write('S');
      continue;
    }


    const matchingWrEntry = await SongWorldRecords.createQueryBuilder('swr')
      .cache(true)
      .innerJoin('swr.song', 'song')
      .where('song.gameId = :gameId AND nickname = :nickname', { gameId: game.id, nickname: leagueTrackerEntry.nickname, })
      .getOne();
    if (matchingWrEntry) {
      leagueTrackerEntry.objectID = matchingWrEntry.objectID;
      leagueTrackerEntry.specialUserCode = matchingWrEntry.specialUserCode;
    }

    await LeagueTrackerEntries.save(leagueTrackerEntry);
    // console.log(leagueTrackerEntry);
    // if (inserted > 3) {

    //   process.exit();
    // }
    inserted++;
    process.stdout.write('.');
  }
  console.log('   Done!');

  console.log(`Finished, inserted ${inserted} records and skipped ${skipped}`);
}).then(() => process.exit(0)).catch((reason) => {
  console.error(reason);
  process.abort();
});
