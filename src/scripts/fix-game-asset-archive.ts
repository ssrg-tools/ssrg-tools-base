import { GameArchivedAsset } from '../entity/Archive/GameArchivedAsset';
import { GameArchivedAssetLink } from '../entity/Archive/GameArchivedAssetLink';
import { createConnection, getRepository } from 'typeorm';

createConnection()
  .then(async () => {
    const GAA = getRepository(GameArchivedAsset);
    const GAAL = getRepository(GameArchivedAssetLink);

    const dupeGAAQuery = GAA.createQueryBuilder('gaa')
      .addSelect('COUNT(gaa.id)', 'c') // fish for dupes
      .addSelect('COUNT(DISTINCT gaal.assetId)', 'distinctGAA') // exclude processed / irrelevant GAA
      .innerJoin('gaa.gamedataFileLinks', 'gaal')
      .orderBy('gaa.sourceUrl', 'DESC')
      .groupBy('gaa.sourceUrl')
      .having('c > 1')
      .andHaving('distinctGAA > 1');
    const dupeGAAs = await dupeGAAQuery.getMany();

    let ii = 0;
    for (const dupe of dupeGAAs) {
      // Relations get swallowed by the GROUP BY, re-fetch them
      const dupeMain = await GAA.findOne(dupe, {
        relations: ['gamedataFileLinks'],
      });
      const dupeSecondaries = await GAA.createQueryBuilder('gaa')
        .innerJoinAndSelect('gaa.gamedataFileLinks', 'gamedataFileLinks')
        .where('gaa.sourceUrl = :sourceUrl AND NOT gaa.id = :id', dupeMain)
        .getMany();
      ii++;
      // console.log({ dupeMain, dupeSecondaries });
      const rewritten: GameArchivedAssetLink[] = [];
      for (const secondary of dupeSecondaries) {
        for (const secondaryLink of secondary.gamedataFileLinks) {
          secondaryLink.asset = dupeMain;
          secondaryLink.assetId = dupeMain.id;
          rewritten.push(secondaryLink);
        }
      }
      const saved = await GAAL.save(rewritten);
      // console.log(`Rewrote ${saved.length} links.`);
      process.stdout.write('.');
    }
    console.log('');
    console.log(`Processed ${dupeGAAs.length} entities.`);

    console.log('Cleaning up dupes.');
    const emptyGAAs = await GAA.createQueryBuilder('gaa')
      .leftJoinAndSelect('gaa.gamedataFileLinks', 'gaal')
      .where('gaal.assetId IS NULL')
      .getMany();
    const deleteResult = await GAA.delete(
      emptyGAAs.map((emptyGAA) => emptyGAA.id),
    );
    console.log(deleteResult);

    console.log('All done.');
  })
  .then(() => process.exit(0))
  .catch((reason) => {
    console.error(reason);
    process.abort();
  });
