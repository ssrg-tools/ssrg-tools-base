import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMetaFields1620281904642 implements MigrationInterface {
  name = 'AddMetaFields1620281904642';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `song_beatmaps` ADD `meta` longtext NOT NULL DEFAULT \'{}\'');
    await queryRunner.query('ALTER TABLE `artists` ADD `meta` longtext NOT NULL DEFAULT \'{}\'');
    await queryRunner.query('ALTER TABLE `artists` ADD `internalIds` varchar(255) NULL COMMENT \'game internal artist ids\' DEFAULT \'[]\'');
    await queryRunner.query('ALTER TABLE `songs` ADD `meta` longtext NOT NULL DEFAULT \'{}\'');
    await queryRunner.query('ALTER TABLE `themes` ADD `meta` longtext NOT NULL DEFAULT \'{}\'');
    await queryRunner.query('ALTER TABLE `themes` ADD `internalId` int NULL COMMENT \'game internal theme id\' DEFAULT NULL');

    await queryRunner.query('CREATE INDEX `byCode` ON `artists` (`internalIds`)');
    await queryRunner.query('CREATE INDEX `byCode` ON `themes` (`internalId`)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `themes` DROP COLUMN `internalId`');
    await queryRunner.query('ALTER TABLE `themes` DROP COLUMN `meta`');
    await queryRunner.query('ALTER TABLE `songs` DROP COLUMN `meta`');
    await queryRunner.query('ALTER TABLE `artists` DROP COLUMN `internalIds`');
    await queryRunner.query('ALTER TABLE `artists` DROP COLUMN `meta`');
    await queryRunner.query('ALTER TABLE `song_beatmaps` DROP COLUMN `meta`');
  }

}
