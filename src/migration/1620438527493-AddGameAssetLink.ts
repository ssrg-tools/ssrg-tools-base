import { MigrationInterface, QueryRunner } from 'typeorm';
import { AddGameAssetArchive1619569017057 } from './1619569017057-AddGameAssetArchive';

export class AddGameAssetLink1620438527493 implements MigrationInterface {
  name = 'AddGameAssetLink1620438527493';

  AddGameAssetArchive1619569017057 = new AddGameAssetArchive1619569017057();

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Delete old asset archive
    await this.AddGameAssetArchive1619569017057.down(queryRunner);

    // Create new asset archive
    await queryRunner.query(
      'CREATE TABLE `files_gameasset_archive` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `fileId` int UNSIGNED NOT NULL, `sourceUrl` varchar(255) NOT NULL, `guid` varchar(255) NOT NULL, UNIQUE INDEX `byGuid` (`guid`), UNIQUE INDEX `REL_fc124abf040f63fe0d61f12cd4` (`fileId`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );

    await queryRunner.query(
      'ALTER TABLE `files_gameasset_archive` ADD CONSTRAINT `FK_fc124abf040f63fe0d61f12cd4b` FOREIGN KEY (`fileId`) REFERENCES `files`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );

    // files_gameasset_archive_links
    await queryRunner.query(
      "CREATE TABLE `files_gameasset_archive_links` (`assetId` int UNSIGNED NOT NULL, `gamedataFileId` int UNSIGNED NOT NULL, `bundleVersion` int UNSIGNED NOT NULL, `resourceVersion` int UNSIGNED NOT NULL, `originalCode` int UNSIGNED NOT NULL, `gameId` int UNSIGNED NOT NULL, `dateArchival` datetime NOT NULL COMMENT 'the date this file was entered into the database', `sourceVersion` varchar(255) NULL, `sourceDateModified` datetime NULL COMMENT 'the date this file was last modified according to the original entry', INDEX `byDateArchival` (`dateArchival`), INDEX `bySourceDateModified` (`sourceDateModified`), UNIQUE INDEX `byVersionsAndCode` (`gameId`, `bundleVersion`, `resourceVersion`, `originalCode`), PRIMARY KEY (`bundleVersion`, `resourceVersion`, `originalCode`, `gameId`)) ENGINE=InnoDB",
    );

    await queryRunner.query(
      'ALTER TABLE `files_gameasset_archive_links` ADD CONSTRAINT `FK_b796408fdcd7d3267c438b62155` FOREIGN KEY (`assetId`) REFERENCES `files_gameasset_archive`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `files_gameasset_archive_links` ADD CONSTRAINT `FK_dab48f6ce70cf627c100c469606` FOREIGN KEY (`gamedataFileId`) REFERENCES `zz_gamedata_files`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `files_gameasset_archive_links` ADD CONSTRAINT `FK_875f63c4450254641c95ebefecb` FOREIGN KEY (`gameId`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete new asset archive
    await queryRunner.query(
      'ALTER TABLE `files_gameasset_archive_links` DROP FOREIGN KEY `FK_b796408fdcd7d3267c438b62155`',
    );

    await queryRunner.query(
      'ALTER TABLE `files_gameasset_archive` DROP FOREIGN KEY `FK_fc124abf040f63fe0d61f12cd4b`',
    );
    await queryRunner.query(
      'DROP INDEX `REL_fc124abf040f63fe0d61f12cd4` ON `files_gameasset_archive`',
    );
    await queryRunner.query('DROP INDEX `byGuid` ON `files_gameasset_archive`');
    await queryRunner.query('DROP TABLE `files_gameasset_archive`');

    // Restore old asset archive
    await this.AddGameAssetArchive1619569017057.up(queryRunner);

    // files_gameasset_archive_links
    await queryRunner.query(
      'ALTER TABLE `files_gameasset_archive_links` DROP FOREIGN KEY `FK_875f63c4450254641c95ebefecb`',
    );
    await queryRunner.query(
      'ALTER TABLE `files_gameasset_archive_links` DROP FOREIGN KEY `FK_dab48f6ce70cf627c100c469606`',
    );
    await queryRunner.query(
      'DROP INDEX `byVersionsAndCode` ON `files_gameasset_archive_links`',
    );
    await queryRunner.query(
      'DROP INDEX `bySourceDateModified` ON `files_gameasset_archive_links`',
    );
    await queryRunner.query(
      'DROP INDEX `byDateArchival` ON `files_gameasset_archive_links`',
    );
    await queryRunner.query('DROP TABLE `files_gameasset_archive_links`');
  }
}
