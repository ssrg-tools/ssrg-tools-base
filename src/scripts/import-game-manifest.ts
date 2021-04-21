
import got from 'got';
import { SuperstarGame } from '../entity/SuperstarGame';
import { createConnection, getRepository } from 'typeorm';
import { GameManifest } from '../entity/GameManifest';
import { GameManifest as GameManifestType } from '../definitions/data/gamemanifest';
import { generate_guid } from '../guid';

const argv = process.argv.slice(2);
if (argv.length < 1) {
  console.error('No input provided. Point me at your a.json.');
  process.exit(1);
}

const [gameKey] = argv;

createConnection().then(async connection => {
  const SuperstarGames = getRepository(SuperstarGame);
  const GameManifests = getRepository(GameManifest);

  const game = await SuperstarGames.findOneOrFail({
    where: {
      key: gameKey,
    },
    select: [
      'id',
      'name',
      'key',
      'apkName',
      'appVersionAndroid',
      'appVersionIOS',
      'baseUrlAssets',
      'baseUrlBucketAssets',
      'baseUrlBucketCdn',
      'baseUrlManifest',
      'baseUrlRanking',
    ],
  });
  if (!game.baseUrlManifest || !game.appVersionAndroid) {
    console.error(`Game '${game.name}' doesn't have manifest version!`);
    process.exit(1);
  }

  const version = game.appVersionAndroid;

  const manifestUrl = `${game.baseUrlManifest}${version}.txt?t=${Date.now()}`;
  console.log(`${game.key}: Downloading ${manifestUrl}`);
  const manifestContents: GameManifestType = await got(manifestUrl).json();

  const existingManifests = await GameManifests.count({
    where: {
      gameId: game.id,
      versionString: version,
    },
  });

  if (existingManifests) {
    console.log(`${game.key}: Manifest for ${game.key}@${version} already exists.`);
  } else {
    const newManifestEntity = GameManifests.create({
      data: manifestContents,
      date: new Date(),
      guid: generate_guid(),
      versionString: version,
      gameId: game.id,
    });

    newManifestEntity.versionNumber = newManifestEntity.versionKeyAsNumber();

    await GameManifests.save(newManifestEntity);
    console.log(`${game.key}: Added Manifest for ${game.key}@${version}.`);
  }

  if (version === manifestContents.ActiveVersion_Android) {
    console.log(`${game.key}: Game app version ${game.key}@${version} already up-2-date.`);
    return;
  }
  game.appVersionAndroid = manifestContents.ActiveVersion_Android;
  game.appVersionIOS = manifestContents.ActiveVersion_IOS;

  game.baseUrlApi = manifestContents.ServerUrl;
  game.baseUrlRanking = manifestContents.MusicRankServerUrl;

  await SuperstarGames.save(game);

  console.log(`${game.key}: Updated game app to ${manifestContents.ActiveVersion_Android}`);
}).then(() => process.exit(0)).catch((reason) => {
  console.error(reason);
  process.abort();
});
