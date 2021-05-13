module.exports = (() => {
  const _ = require('lodash');

  return _.extend({
    type: 'mariadb',
    synchronize: false,
    logging: false,
    entities: [
      'src/entity-gamedata/**/*.ts'
    ],
    migrations: [
      'src/migration-gamedata/**/*.ts'
    ],
    subscribers: [
      'src/subscriber-gamedata/**/*.ts'
    ],
    cli: {
      entitiesDir: 'src/entity-gamedata',
      migrationsDir: 'src/migration-gamedata',
      subscribersDir: 'src/subscriber-gamedata'
    }
  }, require('./config.database.json'), { database: 'ssrg_tools_gamedata' });
})();
