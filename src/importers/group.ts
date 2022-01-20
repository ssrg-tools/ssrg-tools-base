import { Dictionary } from 'lodash';
import { GroupData, MajorGroupData } from '../definitions/data/gameinfo';
import { generate_guid } from '../guid';
import { getRepository } from 'typeorm';
import { SuperstarGame } from '../entity/SuperstarGame';
import { Artist } from '../entity/Artist';

export async function getGroupFromData(
  game: SuperstarGame,
  groupdata: GroupData,
  majorgroupdata: Dictionary<MajorGroupData> | undefined,
  getLocaleString: (code: number) => string,
  Artists = getRepository(Artist),
): Promise<Artist> {
  const name = getLocaleString(groupdata.localeName);
  const groupName =
    groupdata.integrateCode && majorgroupdata
      ? getLocaleString(majorgroupdata[groupdata.integrateCode].integrateLocale)
      : undefined;

  // Case 1: Group already exists, with ID, will update
  const existingGroup = await Artists.createQueryBuilder('artist')
    .where({ gameId: game.id })
    .andWhere("JSON_CONTAINS(artist.internalIds, :code, '$')", {
      code: groupdata.code,
    })
    .getOne();

  if (existingGroup) {
    return existingGroup;
  }

  // Case 2: Group already exists, with name but no ID
  const group2 = await Artists.findOne(null, {
    where: {
      gameId: game.id,
      name,
    },
  });

  if (group2) {
    group2.internalIds = group2.internalIds.concat(groupdata.code);
    group2.group = groupName;
    group2.cardCount = groupdata.equipableSlot;
    group2.imageId = String(groupdata.emblemImage);
    group2.sort = groupdata.orderIndex;
    return Artists.save(group2);
  }

  // Case 3: Create new group
  const newGroup = Artists.create({
    name,
    internalIds: [groupdata.code],
    gameId: game.id,
    guid: generate_guid(),
    group: groupName,
    cardCount: groupdata.equipableSlot,
    imageId: String(groupdata.emblemImage),
    sort: groupdata.orderIndex,
  });

  return newGroup;
}
