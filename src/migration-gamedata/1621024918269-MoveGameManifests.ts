import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoveGameManifests1621024918269 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO ssrg_tools_gamedata.assets_manifests
          (id, gameGuid, versionString, versionNumber, \`data\`, date, guid)
      SELECT
          orig.id, g.guid, orig.versionString, orig.versionNumber, orig.\`data\`, orig.date, orig.guid
      FROM superstar_log.zz_gamedata_manifests orig
      INNER JOIN superstar_log.superstar_games g ON g.id = orig.gameId`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Empty
  }
}
