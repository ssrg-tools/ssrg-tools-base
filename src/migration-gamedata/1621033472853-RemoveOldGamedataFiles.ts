import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveOldGamedataFiles1621033472853 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `superstar_log`.`files_gameasset_archive_links` DROP FOREIGN KEY `FK_dab48f6ce70cf627c100c469606`',
    );

    await queryRunner.query(
      'ALTER TABLE `superstar_log`.`zz_gamedata_files` DROP FOREIGN KEY `FK_ec1d70d65bd4292f0c80ccc2eb0`',
    );
    await queryRunner.query('DROP INDEX `perGameAndVersionAndKey` ON `superstar_log`.`zz_gamedata_files`');
    await queryRunner.query('DROP INDEX `IDX_b4558fd6b95c960ad030cbd348` ON `superstar_log`.`zz_gamedata_files`');
    await queryRunner.query('DROP INDEX `byDate` ON `superstar_log`.`zz_gamedata_files`');
    await queryRunner.query('DROP TABLE `superstar_log`.`zz_gamedata_files`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `superstar_log`.`zz_gamedata_files` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `gameId` int UNSIGNED NOT NULL, `version` int UNSIGNED NOT NULL, `key` varchar(255) NOT NULL, `data` longtext NOT NULL, `date` datetime NOT NULL, `guid` varchar(255) NOT NULL, `fingerprint` varchar(255) NOT NULL, INDEX `byDate` (`date`), UNIQUE INDEX `IDX_b4558fd6b95c960ad030cbd348` (`guid`), UNIQUE INDEX `perGameAndVersionAndKey` (`gameId`, `version`, `key`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `superstar_log`.`zz_gamedata_files` ADD CONSTRAINT `FK_ec1d70d65bd4292f0c80ccc2eb0` FOREIGN KEY (`gameId`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );

    // TODO: Ensure data? Adding foreign keys would fail without data...
    // await queryRunner.query(
    //   'ALTER TABLE `superstar_log`.`files_gameasset_archive_links` ADD CONSTRAINT `FK_dab48f6ce70cf627c100c469606` FOREIGN KEY (`gamedataFileId`) REFERENCES `zz_gamedata_files`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    // );
  }
}
