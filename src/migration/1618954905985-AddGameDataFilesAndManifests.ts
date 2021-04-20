import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGameDataFilesAndManifests1618954905985 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE `zz_gamedata_manifests` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `gameId` int UNSIGNED NOT NULL, `versionString` varchar(255) NOT NULL, `versionNumber` int NOT NULL, `data` longtext NOT NULL, `date` datetime NOT NULL, `guid` varchar(255) NOT NULL, INDEX `byDate` (`date`), UNIQUE INDEX `IDX_5d6982d246b30150073a79d457` (`guid`), UNIQUE INDEX `perGameAndVersion` (`gameId`, `versionString`), PRIMARY KEY (`id`)) ENGINE=InnoDB');
    await queryRunner.query('CREATE TABLE `zz_gamedata_files` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `gameId` int UNSIGNED NOT NULL, `version` int UNSIGNED NOT NULL, `key` varchar(255) NOT NULL, `data` longtext NOT NULL, `date` datetime NOT NULL, `guid` varchar(255) NOT NULL, `fingerprint` varchar(255) NOT NULL, INDEX `byDate` (`date`), UNIQUE INDEX `IDX_b4558fd6b95c960ad030cbd348` (`guid`), UNIQUE INDEX `perGameAndVersionAndKey` (`gameId`, `version`, `key`), PRIMARY KEY (`id`)) ENGINE=InnoDB');
    await queryRunner.query('ALTER TABLE `zz_gamedata_manifests` ADD CONSTRAINT `FK_b44767288778601ef1e49033985` FOREIGN KEY (`gameId`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT');
    await queryRunner.query('ALTER TABLE `zz_gamedata_files` ADD CONSTRAINT `FK_ec1d70d65bd4292f0c80ccc2eb0` FOREIGN KEY (`gameId`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `zz_gamedata_files` DROP FOREIGN KEY `FK_ec1d70d65bd4292f0c80ccc2eb0`');
    await queryRunner.query('ALTER TABLE `zz_gamedata_manifests` DROP FOREIGN KEY `FK_b44767288778601ef1e49033985`');
    await queryRunner.query('DROP INDEX `perGameAndVersionAndKey` ON `zz_gamedata_files`');
    await queryRunner.query('DROP INDEX `IDX_b4558fd6b95c960ad030cbd348` ON `zz_gamedata_files`');
    await queryRunner.query('DROP INDEX `byDate` ON `zz_gamedata_files`');
    await queryRunner.query('DROP TABLE `zz_gamedata_files`');
    await queryRunner.query('DROP INDEX `perGameAndVersion` ON `zz_gamedata_manifests`');
    await queryRunner.query('DROP INDEX `IDX_5d6982d246b30150073a79d457` ON `zz_gamedata_manifests`');
    await queryRunner.query('DROP INDEX `byDate` ON `zz_gamedata_manifests`');
    await queryRunner.query('DROP TABLE `zz_gamedata_manifests`');
  }

}
