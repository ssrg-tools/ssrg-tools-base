import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGameAssetArchive1619569017057 implements MigrationInterface {
  name = 'AddGameAssetArchive1619569017057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `files_gameasset_archive` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `gameId` int UNSIGNED NOT NULL, `fileId` int UNSIGNED NOT NULL, `gameAssetVersion` int UNSIGNED NOT NULL, `gameSubAssetVersion` int UNSIGNED NOT NULL, `originalCode` int UNSIGNED NOT NULL, `dateArchival` datetime NOT NULL COMMENT 'the date this file was entered into the database', `sourceUrl` varchar(255) NOT NULL, `sourceVersion` varchar(255) NULL, `sourceDateModified` datetime NULL COMMENT 'the date this file was last modified according to the original entry', `guid` varchar(255) NOT NULL, INDEX `byDateArchival` (`dateArchival`), INDEX `bySourceDateModified` (`sourceDateModified`), UNIQUE INDEX `byVersionsAndCode` (`gameId`, `gameAssetVersion`, `gameSubAssetVersion`, `originalCode`), UNIQUE INDEX `byGuid` (`guid`), UNIQUE INDEX `REL_5539a59caa01d26f73a9f50855` (`fileId`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'ALTER TABLE `files_gameasset_archive` ADD CONSTRAINT `FK_740f3cba470150459d15c51ea8d` FOREIGN KEY (`gameId`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `files_gameasset_archive` ADD CONSTRAINT `FK_5539a59caa01d26f73a9f508554` FOREIGN KEY (`fileId`) REFERENCES `files`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `files_gameasset_archive` DROP FOREIGN KEY `FK_5539a59caa01d26f73a9f508554`');
    await queryRunner.query('ALTER TABLE `files_gameasset_archive` DROP FOREIGN KEY `FK_740f3cba470150459d15c51ea8d`');
    await queryRunner.query('DROP INDEX `REL_5539a59caa01d26f73a9f50855` ON `files_gameasset_archive`');
    await queryRunner.query('DROP INDEX `byGuid` ON `files_gameasset_archive`');
    await queryRunner.query('DROP INDEX `byVersionsAndCode` ON `files_gameasset_archive`');
    await queryRunner.query('DROP INDEX `bySourceDateModified` ON `files_gameasset_archive`');
    await queryRunner.query('DROP INDEX `byDateArchival` ON `files_gameasset_archive`');
    await queryRunner.query('DROP TABLE `files_gameasset_archive`');
  }
}
