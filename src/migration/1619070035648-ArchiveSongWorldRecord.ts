import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArchiveSongWorldRecord1619070035648 implements MigrationInterface {
  name = 'ArchiveSongWorldRecord1619070035648';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE `zz__archive_song_world_records` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `gameId` int UNSIGNED NOT NULL, `songCode` int UNSIGNED NOT NULL, `seasonCode` int UNSIGNED NOT NULL, `data` longtext NOT NULL, `dateEntry` datetime NOT NULL COMMENT \'the date this entry was entered into the database\', `dateObserved` datetime NOT NULL COMMENT \'the date this file was downloaded\', `source` varchar(255) NOT NULL DEFAULT \'manual\', `guid` varchar(255) NOT NULL, `fingerprint` varchar(255) NOT NULL, INDEX `byDateEntry` (`dateEntry`), INDEX `byDateObserved` (`dateObserved`), INDEX `bySongAndSeason` (`gameId`, `songCode`, `seasonCode`), UNIQUE INDEX `IDX_a878b35267e6fe895ef4bd6041` (`guid`), PRIMARY KEY (`id`)) ENGINE=InnoDB');
    await queryRunner.query('ALTER TABLE `zz__archive_song_world_records` ADD CONSTRAINT `FK_a2f2ebae5c9fcd5f2e6aac104ee` FOREIGN KEY (`gameId`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `zz__archive_song_world_records` DROP FOREIGN KEY `FK_a2f2ebae5c9fcd5f2e6aac104ee`');
    await queryRunner.query('DROP INDEX `IDX_a878b35267e6fe895ef4bd6041` ON `zz__archive_song_world_records`');
    await queryRunner.query('DROP INDEX `bySongAndSeason` ON `zz__archive_song_world_records`');
    await queryRunner.query('DROP INDEX `byDateObserved` ON `zz__archive_song_world_records`');
    await queryRunner.query('DROP INDEX `byDateEntry` ON `zz__archive_song_world_records`');
    await queryRunner.query('DROP TABLE `zz__archive_song_world_records`');
  }

}
