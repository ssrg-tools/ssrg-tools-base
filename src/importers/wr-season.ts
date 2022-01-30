import { groupBy, head, isEmpty, keyBy, mapValues } from 'lodash';
import moment from 'moment';
import { getRepository, In, Repository } from 'typeorm';
import { WorldRecordData } from '../definitions/data/gameinfo';
import { GamedataFile } from '../entity-gamedata/GamedataFile';
import { SuperstarGame } from '../entity/SuperstarGame';
import { WorldRecordSeason } from '../entity/WorldRecordSeason';
import { generate_guid } from '../guid';

export async function loadLatestSeasonData(
  game: SuperstarGame,
  GameDataFiles: Repository<GamedataFile>,
): Promise<WorldRecordData[]> {
  return GameDataFiles.findOne({
    where: {
      gameGuid: game.guid,
      key: 'WorldRecordData',
    },
    order: {
      version: 'DESC',
    },
  }).then(gdf => gdf?.data as WorldRecordData[]);
}

export async function processSeasonData(
  game: SuperstarGame,
  gamedataSeasons: WorldRecordData[],
  WorldRecordSeasons: Repository<WorldRecordSeason> = getRepository(WorldRecordSeason),
) {
  if (!gamedataSeasons || isEmpty(gamedataSeasons)) {
    console.log(' No game data.');
    return;
  }

  const byCode = groupBy(gamedataSeasons, 'seasonCode');
  const seasonTypeByCode = mapValues(byCode, 'length');

  const existingSeasons = await WorldRecordSeasons.find({
    where: {
      dalcomSeasonId: In(Object.keys(byCode).map(x => parseInt(x, 10))),
      gameId: game.id,
    },
  });
  const existingSeasonsByCode = keyBy(existingSeasons, 'dalcomSeasonId');

  const changedSeasons: WorldRecordSeason[] = [];
  for (const dalcomSeasonIdStr of Object.keys(byCode)) {
    const dalcomSeasonId = parseInt(dalcomSeasonIdStr, 10);
    const firstRank = head(byCode[dalcomSeasonId]);
    const dateStart = moment(firstRank.startAt);
    const dateEnd = moment(firstRank.endAt);
    if (existingSeasonsByCode[dalcomSeasonId]) {
      console.log(` [Skip] Game ${game.key} season #${dalcomSeasonId} already inserted, not adding. (${dateStart})`);
      continue;
    }

    const dateStartUpper = dateStart.clone().add(10, 'days');
    const dateStartLower = dateStart.clone().add(-10, 'days');
    const similarSeasonsQuery = WorldRecordSeasons.createQueryBuilder('season')
      .where('season.dateStart < :upper AND season.dateStart > :lower', {
        lower: dateStartLower.toDate(),
        upper: dateStartUpper.toDate(),
      })
      .andWhere('season.gameId = :gameId', { gameId: game.id });

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
      changedSeasons.push(similarSeason);
      continue;
    }

    console.log(` [Add] Adding season #${dalcomSeasonId}. (${dateStart})`);
    const season = WorldRecordSeasons.create({
      dateStart: dateStart.toDate(),
      dateEnd: dateEnd.toDate(),
      bonusSystem: seasonTypeByCode[dalcomSeasonId] === 100 ? 'top100-no-tie' : 'top1-tie',
      guid: generate_guid(),
      dalcomSeasonId,
      gameId: game.id,
    });

    changedSeasons.push(season);
  }

  return changedSeasons;
}
