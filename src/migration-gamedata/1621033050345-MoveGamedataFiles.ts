import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoveGamedataFiles1621033050345 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `INSERT INTO ssrg_tools_gamedata.assets_files
          (id, gameGuid, version, \`key\`, \`data\`, date, guid, fingerprint)
      SELECT
          orig.id, g.guid, orig.version, orig.key, orig.\`data\`, orig.date, orig.guid, orig.fingerprint
      FROM superstar_log.zz_gamedata_files orig
      INNER JOIN superstar_log.superstar_games g ON g.id = orig.gameId`,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Empty
  }
}
