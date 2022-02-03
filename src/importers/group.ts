import { Dictionary } from 'lodash';
import { getRepository } from 'typeorm';
import { GroupData, MajorGroupData } from '../definitions/data/gameinfo';
import { Artist } from '../entity/Artist';
import { SuperstarGame } from '../entity/SuperstarGame';
import { generate_guid } from '../guid';

export async function getGroupFromData(
  game: SuperstarGame,
  groupdata: GroupData,
  majorgroupdata: Dictionary<MajorGroupData> | undefined,
  getLocaleString: (code: number) => string,
  Artists = getRepository(Artist),
  { log } = console,
): Promise<Artist> {
  const name = getLocaleString(groupdata.localeName).replace(/[ _\-]\((?:event|hidden)\)/gi, '');
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
    let changed = false;
    if (!existingGroup.group && groupName) {
      existingGroup.group = groupName;
      changed = true;
    }
    if (!existingGroup.sort && groupdata.orderIndex) {
      existingGroup.sort = groupdata.orderIndex;
      changed = true;
    }
    if (!existingGroup.cardCount && groupdata.equipableSlot) {
      existingGroup.cardCount = groupdata.equipableSlot;
      changed = true;
    }
    if (!existingGroup.imageId && groupdata.emblemImage) {
      existingGroup.imageId = groupdata.emblemImage.toString();
      changed = true;
    }
    if (changed) {
      log(`Artist: Updating group ${existingGroup.name}`);
      await Artists.save(existingGroup);
    }
    return existingGroup;
  }

  // Case 2: Group already exists, with name but no ID
  const group2 = await Artists.createQueryBuilder('artist')
    .where({ gameId: game.id })
    .andWhere('LOWER(artist.name) = LOWER(:name)', { name })
    .getOne();

  if (group2) {
    log(`Artist: Group ${name} already exists, but no ID`);
    group2.internalIds = group2.internalIds.concat(groupdata.code);
    group2.group = groupName;
    group2.cardCount = groupdata.equipableSlot;
    group2.imageId = String(groupdata.emblemImage);
    group2.sort = groupdata.orderIndex;
    group2.name = name;
    return Artists.save(group2);
  }

  // Case 3: Create new group
  log(`Artist: Creating new group ${name}`);
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
