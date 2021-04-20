import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGameBucketLinks1618954340543 implements MigrationInterface {
  name = 'AddGameBucketLinks1618954340543';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `superstar_games` ADD `appVersionAndroid` varchar(255) NULL');
    await queryRunner.query('ALTER TABLE `superstar_games` ADD `appVersionIOS` varchar(255) NULL');
    await queryRunner.query('ALTER TABLE `superstar_games` ADD `baseUrlManifest` varchar(255) NULL COMMENT \'folder to manifest\'');
    await queryRunner.query('ALTER TABLE `superstar_games` ADD `baseUrlRanking` varchar(255) NULL COMMENT \'base url to world record info\'');
    await queryRunner.query('ALTER TABLE `superstar_games` ADD `baseUrlAssets` varchar(255) NULL COMMENT \'link to game assets\'');
    await queryRunner.query('ALTER TABLE `superstar_games` ADD `baseUrlBucketAssets` varchar(255) NULL COMMENT \'main assets base url\'');
    await queryRunner.query('ALTER TABLE `superstar_games` ADD `baseUrlBucketCdn` varchar(255) NULL COMMENT \'main CDN base url\'');
    await queryRunner.query('ALTER TABLE `superstar_games` ADD `baseUrlApi` varchar(255) NULL COMMENT \'game api endpoint\'');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `superstar_games` DROP COLUMN `appVersionAndroid`');
    await queryRunner.query('ALTER TABLE `superstar_games` DROP COLUMN `appVersionIOS`');
    await queryRunner.query('ALTER TABLE `superstar_games` DROP COLUMN `baseUrlBucketCdn`');
    await queryRunner.query('ALTER TABLE `superstar_games` DROP COLUMN `baseUrlBucketAssets`');
    await queryRunner.query('ALTER TABLE `superstar_games` DROP COLUMN `baseUrlAssets`');
    await queryRunner.query('ALTER TABLE `superstar_games` DROP COLUMN `baseUrlRanking`');
    await queryRunner.query('ALTER TABLE `superstar_games` DROP COLUMN `baseUrlManifest`');
    await queryRunner.query('ALTER TABLE `superstar_games` DROP COLUMN `baseUrlApi`');
  }

}
