module.exports = (() => {
  const _ = require('lodash');

  return _.extend(
    {
      type: 'mariadb',
      synchronize: false,
      logging: false,
      entities: ['src/entity-logs/**/*.ts'],
      migrations: ['src/migration-logs/**/*.ts'],
      subscribers: ['src/subscriber-logs/**/*.ts'],
      cli: {
        entitiesDir: 'src/entity-logs',
        migrationsDir: 'src/migration-logs',
        subscribersDir: 'src/subscriber-logs',
      },
    },
    require('./config.database.json'),
    { database: 'ssrg_tools_logs' },
  );
})();
