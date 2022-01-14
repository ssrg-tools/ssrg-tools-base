import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { SuperstarGame } from '../entity/SuperstarGame';
import { createConnection, getRepository } from 'typeorm';
import { InfoAggregate } from '../definitions/data/InfoAggregate';
import { processAggregate } from '../gamedata';

const argv = process.argv.slice(2);
if (argv.length < 2) {
  console.error('No input provided. Point me at your a.json.');
  process.exit(1);
}

const [gameKey, infoPath] = argv;

if (!existsSync(infoPath)) {
  console.error(`File '${infoPath}' does not exist.`);
  process.exit(1);
}

createConnection()
  .then(async () => {
    const game = await getRepository(SuperstarGame).findOneOrFail({
      where: { key: gameKey },
      select: ['name', 'apkName', 'encryptionKey'],
    });
    if (!game.encryptionKey) {
      console.error(`Game '${game.name}' doesn't have an encryption key!`);
      process.exit(1);
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const infoAggregate: InfoAggregate = require(infoPath);

    const basedir = resolve(
      __dirname,
      '..',
      '..',
      '..',
      'assets',
      'gameInfo',
      gameKey,
    );
    mkdirSync(basedir, { recursive: true });

    return processAggregate(game.encryptionKey, infoAggregate, basedir);
  })
  .then(() => process.exit(0))
  .catch((reason) => {
    console.error(reason);
    process.abort();
  });
