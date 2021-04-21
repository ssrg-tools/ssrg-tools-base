import crypto from 'crypto';
import _ from 'lodash';
import { readdirSync, lstatSync, readFileSync } from 'fs';
import { resolve, join, basename } from 'path';
import { SuperstarGame } from '../entity/SuperstarGame';
import { createConnection, getRepository } from 'typeorm';
import { fingerprintAlgo, GameDataFile } from '../entity/GameDataFile';
import { generate_guid } from '../guid';
import { InfoAggregate } from '../definitions/data/InfoAggregate';

const basedir = resolve(__dirname, '..', '..', '..', 'assets', 'gameInfo');

// Imports game data files from local storage
createConnection().then(async connection => {
  const GameDataFiles = getRepository(GameDataFile);
  const games = _.keyBy(await getRepository(SuperstarGame).find(), 'key');

  const availableGameKeys = readdirSync(basedir);

  for (const gameKey of availableGameKeys) {
    const game = games[gameKey];
    if (!game) {
      console.error(`[ERROR] Game ${gameKey} does not exist in the database.`);
      continue;
    }
    const gameFolder = join(basedir, gameKey);
    if (!lstatSync(gameFolder).isDirectory()) {
      continue;
    }

    const dataFolders = readdirSync(gameFolder);
    for (const dataFolderName of dataFolders) {
      const dataFolder = join(gameFolder, dataFolderName);
      if (!lstatSync(dataFolder).isDirectory()) {
        continue;
      }

      console.log(`Processing ${gameKey}@${dataFolderName}.`);

      const infoAggregate: InfoAggregate = require(join(dataFolder, 'Info.json'));
      const aggregateVersion = infoAggregate.version;

      const files = readdirSync(dataFolder);
      for (const fileName of files) {
        const filePath = join(dataFolder, fileName);
        if (!lstatSync(filePath).isFile()) {
          continue;
        }

        const key = basename(fileName, '.json');
        const version = key === 'Info' ? aggregateVersion : infoAggregate.context[key].version;

        const contents = JSON.parse(readFileSync(filePath).toString());

        const contentsString = JSON.stringify(contents);
        const fingerprint = crypto.createHash(fingerprintAlgo).update(contentsString).digest('hex');

        const gameDataFile = GameDataFiles.create({
          data: contents,
          date: new Date(),
          guid: generate_guid(),
          gameId: game.id,
          version,
          key,
          fingerprint,
        });

        const existingGameDataFile = await GameDataFiles.count({
          where: {
            gameId: game.id,
            version,
            key,
          }
        });

        if (existingGameDataFile) {
          console.log(`${game.key}@${version}: ${key} exists.`);
        } else {
          await GameDataFiles.save(gameDataFile);
          console.log(`${game.key}@${version}: Imported ${key}.`);
        }
      }
    }
  }

  console.log('All done.');
}).then(() => process.exit(0)).catch((reason) => {
  console.error(reason);
  process.abort();
});
