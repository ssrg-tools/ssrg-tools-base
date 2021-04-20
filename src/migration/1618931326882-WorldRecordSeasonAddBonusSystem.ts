import { MigrationInterface, QueryRunner } from 'typeorm';

export class WorldRecordSeasonAddBonusSystem1618931326882 implements MigrationInterface {
  name = 'WorldRecordSeasonAddBonusSystem1618931326882';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `world_record_seasons` ADD `bonusSystem` varchar(255) NOT NULL DEFAULT \'top100-no-tie\' AFTER `dalcomSeasonId`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `world_record_seasons` DROP COLUMN `bonusSystem`');
  }

}
