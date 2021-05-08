import { SuperstarGame } from '@base/entity/SuperstarGame';
import { createConnection, getRepository, In } from 'typeorm';
import { GameDataFile } from '@base/entity/GameDataFile';
import { generate_guid } from '@base/guid';
import _ from 'lodash';
import { WorldRecordData } from '@base/definitions/data/gameinfo';
import { WorldRecordSeason } from '@base/entity/WorldRecordSeason';
import moment from 'moment';

createConnection()
  .then(async () => {
    const SuperstarGames = getRepository(SuperstarGame);
    const GameDataFiles = getRepository(GameDataFile);
    const WorldRecordSeasons = getRepository(WorldRecordSeason);

    const games = _.keyBy(await SuperstarGames.find(), 'key');

    for (const game of Object.values(games)) {
      console.log(`Processing ${game.name}`);
      const gamedataSeasons: WorldRecordData[] = await GameDataFiles.findOne({
        where: {
          gameId: game.id,
          key: 'WorldRecordData',
        },
        order: {
          version: 'DESC',
        },
      }).then((gdf) => gdf?.data as WorldRecordData[]);

      if (!gamedataSeasons || _.isEmpty(gamedataSeasons)) {
        console.log(' No game data.');
        continue;
      }

      const byCode = _.groupBy(gamedataSeasons, 'seasonCode');
      const seasonTypeByCode = _.mapValues(byCode, 'length');

      const existingSeasons = await WorldRecordSeasons.find({
        where: {
          dalcomSeasonId: In(Object.keys(byCode).map((x) => parseInt(x, 10))),
          gameId: game.id,
        },
      });
      const existingSeasonsByCode = _.keyBy(existingSeasons, 'dalcomSeasonId');

      for (const dalcomSeasonIdStr of Object.keys(byCode)) {
        const dalcomSeasonId = parseInt(dalcomSeasonIdStr, 10);
        const firstRank = _.head(byCode[dalcomSeasonId]);
        const dateStart = moment(firstRank.startAt);
        const dateEnd = moment(firstRank.endAt);
        if (existingSeasonsByCode[dalcomSeasonId]) {
          console.log(
            ` [Skip] Game ${game.key} season #${dalcomSeasonId} already inserted, not adding. (${dateStart})`,
          );
          // console.log(existingSeasonsByCode[dalcomSeasonId]);
          continue;
        }

        const dateStartUpper = dateStart.clone().add(10, 'days');
        const dateStartLower = dateStart.clone().add(-10, 'days');
        const similarSeasonsQuery = await WorldRecordSeasons.createQueryBuilder(
          'season',
        )
          .where('season.dateStart < :upper AND season.dateStart > :lower', {
            lower: dateStartLower.toDate(),
            upper: dateStartUpper.toDate(),
          })
          .andWhere('season.gameId = :gameId', { gameId: game.id });
        // console.log(similarSeasonsQuery.getQueryAndParameters());
        const similarSeasons = await similarSeasonsQuery.getMany();

        if (similarSeasons.length) {
          console.log(
            ` [Similar] Game ${game.key} season #${dalcomSeasonId} has similar season, updating, not adding. (${dateStart})`,
          );
          if (similarSeasons.length !== 1) {
            console.error(':eunhuh:');
            continue;
          }
          const similarSeason = similarSeasons[0];
          similarSeason.dalcomSeasonId = dalcomSeasonId;
          await WorldRecordSeasons.save(similarSeason);
          continue;
        }

        console.log(` [Add] Adding season #${dalcomSeasonId}. (${dateStart})`);
        const season = WorldRecordSeasons.create({
          dateStart: dateStart.toDate(),
          dateEnd: dateEnd.toDate(),
          bonusSystem:
            seasonTypeByCode[dalcomSeasonId] === 100
              ? 'top100-no-tie'
              : 'top1-tie',
          guid: generate_guid(),
          dalcomSeasonId,
          gameId: game.id,
        });

        await WorldRecordSeasons.save(season);
      }
    }

    console.log('All done.');
  })
  .then(() => process.exit(0))
  .catch((reason) => {
    console.error(reason);
    process.abort();
  });
