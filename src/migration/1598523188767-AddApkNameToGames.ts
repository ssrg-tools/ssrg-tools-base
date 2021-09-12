import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddApkNameToGames1598523188767 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `superstar_games` ADD `apkName` varchar(255) NOT NULL AFTER meta;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `superstar_games` DROP COLUMN `apkName`;',
    );
  }
}
