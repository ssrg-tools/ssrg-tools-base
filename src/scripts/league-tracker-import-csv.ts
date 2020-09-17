import path from 'path';
import fs from 'fs';
import { createConnection, getRepository } from 'typeorm';
import csvParser from 'csv-parse/lib/sync';
import moment from 'moment';
import { LeagueTrackerEntry } from '../entity/LeagueTrackerEntry';
import { generate_guid } from '../guid';
import { SuperstarGame } from '../entity/SuperstarGame';
import { SongWorldRecord } from '../entity/SongWorldRecord';

createConnection().then(async connection => {
  const gameKey = process.argv[2];
  if (!gameKey) {
    console.error(`No gameKey provided.`);
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

  const contents = fs.readFileSync(leagueDataFilePath, 'utf8');
  const records: any[] = csvParser(contents, {
    // columns: true,
    skip_empty_lines: true
  }).slice(1);

  if (!records.length) {
    console.error(`File '${leagueDataFilePath}' has no records.`);
    process.exit(1);
  }

  console.log(`Processing '${records.length}' records!`);

  let inserted = 0;
  let skipped = 0;

  const LeagueTrackerEntries = getRepository(LeagueTrackerEntry);
  const SongWorldRecords = getRepository(SongWorldRecord);
  for (const record of records) {
    const nickname = record[2];
    if (!record[1] || !record[2]) {
      continue;
    }

    const date = moment(record[4] + ' 17:00:00+00:00', 'MM/DD/YYYY HH:mm:ssZ').toDate();

    const existing = await LeagueTrackerEntries.findOne(undefined, {
      where: {
        date,
        nickname,
        gameId: game.id,
      },
    });
    if (existing) {
      skipped++;
      process.stdout.write('S');
      continue;
    }

    const leagueTrackerEntry = LeagueTrackerEntries.create({
      nickname,
      score: parseInt((record[3] || '').replace(/[,.]/g, ''), 10),
      divisionGroup: parseInt(record[1], 10),
      isSSRGDiscord: record[5] ? 1 : 0,
      date,
      game,
      guid: generate_guid(),
    });

    const matchingWrEntry = await SongWorldRecords.createQueryBuilder('swr')
      .cache(true)
      .innerJoin('swr.song', 'song')
      .where('song.gameId = :gameId AND nickname = :nickname', { gameId: game.id, nickname, })
      .getOne();
    if (matchingWrEntry) {
      leagueTrackerEntry.objectID = matchingWrEntry.objectID;
      leagueTrackerEntry.specialUserCode = matchingWrEntry.specialUserCode;
    }

    await LeagueTrackerEntries.save(leagueTrackerEntry);
    inserted++;
    process.stdout.write('.');
  }
  console.log('   Done!');

  console.log(`Finished, inserting ${inserted} records and skipping ${skipped}`);
}).then(() => process.exit(0)).catch((reason) => {
  console.error(reason);
  process.abort();
});
