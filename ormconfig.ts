module.exports = (() => {
  const _ = require('lodash');

  return _.extend(
    {
      type: 'mariadb',
      synchronize: false,
      logging: false,
      entities: ['src/entity/**/*.ts'],
      migrations: ['src/migration/**/*.ts'],
      subscribers: ['src/subscriber/**/*.ts'],
      cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
      },
    },
    require('./config.database.json'),
  );
})();
