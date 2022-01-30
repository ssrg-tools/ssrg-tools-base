import { SuperstarGame } from '../entity/SuperstarGame';
import { createConnection, getRepository } from 'typeorm';
import { GamedataFile } from '../entity-gamedata/GamedataFile';
import _ from 'lodash';
import { WorldRecordSeason } from '../entity/WorldRecordSeason';
import { loadLatestSeasonData, processSeasonData } from '../importers/wr-season';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const GamedataOrmConfig = require('../../ormconfig.gamedata');
GamedataOrmConfig.name = 'gamedata';

createConnection()
  .then(() => createConnection(GamedataOrmConfig))
  .then(async () => {
    const SuperstarGames = getRepository(SuperstarGame);
    const GameDataFiles = getRepository(GamedataFile, GamedataOrmConfig.name);
    const WorldRecordSeasons = getRepository(WorldRecordSeason);

    const games = _.keyBy(await SuperstarGames.find(), 'key');

    for (const game of Object.values(games)) {
      console.log(`Processing ${game.name}`);

      const seasondata = await loadLatestSeasonData(game, GameDataFiles);
      const seasons = await processSeasonData(game, seasondata, WorldRecordSeasons);
      await WorldRecordSeasons.save(seasons);
    }

    console.log('All done.');
  })
  .then(() => process.exit(0))
  .catch(reason => {
    console.error(reason);
    process.abort();
  });
