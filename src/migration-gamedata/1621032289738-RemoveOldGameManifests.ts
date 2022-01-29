import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveOldGameManifests1621032289738 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `superstar_log`.`zz_gamedata_manifests` DROP FOREIGN KEY `FK_b44767288778601ef1e49033985`',
    );
    await queryRunner.query('DROP INDEX `perGameAndVersion` ON `superstar_log`.`zz_gamedata_manifests`');
    await queryRunner.query('DROP INDEX `IDX_5d6982d246b30150073a79d457` ON `superstar_log`.`zz_gamedata_manifests`');
    await queryRunner.query('DROP INDEX `byDate` ON `superstar_log`.`zz_gamedata_manifests`');
    await queryRunner.query('DROP TABLE `superstar_log`.`zz_gamedata_manifests`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `superstar_log`.`zz_gamedata_manifests` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `gameId` int UNSIGNED NOT NULL, `versionString` varchar(255) NOT NULL, `versionNumber` int NOT NULL, `data` longtext NOT NULL, `date` datetime NOT NULL, `guid` varchar(255) NOT NULL, INDEX `byDate` (`date`), UNIQUE INDEX `IDX_5d6982d246b30150073a79d457` (`guid`), UNIQUE INDEX `perGameAndVersion` (`gameId`, `versionString`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `superstar_log`.`zz_gamedata_manifests` ADD CONSTRAINT `FK_b44767288778601ef1e49033985` FOREIGN KEY (`gameId`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
  }
}
