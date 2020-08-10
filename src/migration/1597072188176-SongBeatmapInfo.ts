import { MigrationInterface, QueryRunner } from 'typeorm';

export class SongBeatmapInfo1597072188176 implements MigrationInterface {
  name = 'SongBeatmapInfo1597072188176';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`song_beatmaps\` (
      \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
      \`song_id\` int UNSIGNED NOT NULL,
      \`difficulty\` varchar(255) NOT NULL,
      \`dalcom_beatmap_filename\` varchar(255) NOT NULL,
      \`index_beat_min\` int UNSIGNED NOT NULL,
      \`index_beat_max\` int UNSIGNED NOT NULL,
      \`count_notes_total\` int UNSIGNED NOT NULL,
      \`count_notes_nocombo\` int UNSIGNED NOT NULL,
      \`count_taps\` int UNSIGNED NOT NULL,
      \`count_sliders_nocombo\` int UNSIGNED NOT NULL,
      \`count_sliders_total\` int UNSIGNED NOT NULL,
      \`beatmap_date_processed\` datetime NOT NULL COMMENT 'date when the beatmap has been processed' DEFAULT CURRENT_TIMESTAMP,
      \`difficulty_id\` smallint UNSIGNED NOT NULL,
      \`dalcom_beatmap_fingerprint\` varchar(255) NOT NULL,
      \`guid\` varchar(255) NULL,
      INDEX \`IDX_c8d12ea5178e0709deb03433d8\` (\`song_id\`),
      UNIQUE INDEX \`IDX_83862467ad0a3afd66f49af374\` (\`guid\`),
      PRIMARY KEY (\`id\`))
      ENGINE=InnoDB`);
    await queryRunner.query('ALTER TABLE `songs` ADD `dalcom_song_id` '
      + 'varchar(255) NULL COMMENT \'game internal song id\' DEFAULT NULL AFTER `length_seconds`');
    await queryRunner.query('ALTER TABLE `songs` ADD UNIQUE INDEX `IDX_f83bd453948597ddc46f2b4bb9` (`dalcom_song_id`)');
    await queryRunner.query('ALTER TABLE `songs` ADD `dalcom_song_filename` varchar(255) NULL COMMENT \'game internal song filename\' DEFAULT NULL AFTER `dalcom_song_id`');
    await queryRunner.query('ALTER TABLE `songs` ADD UNIQUE INDEX `IDX_dcae9d25b142b942fff5fd4c83` (`dalcom_song_filename`)');
    await queryRunner.query('ALTER TABLE `songs` ADD `beatmap_fingerprint` varchar(255) NULL COMMENT \'game internal song filename\' DEFAULT NULL');
    await queryRunner.query('ALTER TABLE `songs` ADD UNIQUE INDEX `IDX_a8d2f0f709399856f601de34c3` (`beatmap_fingerprint`)');
    await queryRunner.query('ALTER TABLE `songs` ADD `beatmap_date_processed` datetime NULL COMMENT \'date when the beatmaps had been processed\' DEFAULT NULL AFTER `dalcom_song_filename`');
    await queryRunner.query('ALTER TABLE `song_beatmaps` ADD CONSTRAINT `FK_c8d12ea5178e0709deb03433d82` FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `song_beatmaps` DROP FOREIGN KEY `FK_c8d12ea5178e0709deb03433d82`');
    await queryRunner.query('ALTER TABLE `songs` DROP COLUMN `beatmap_date_processed`');
    await queryRunner.query('ALTER TABLE `songs` DROP INDEX `IDX_a8d2f0f709399856f601de34c3`');
    await queryRunner.query('ALTER TABLE `songs` DROP COLUMN `beatmap_fingerprint`');
    await queryRunner.query('ALTER TABLE `songs` DROP INDEX `IDX_dcae9d25b142b942fff5fd4c83`');
    await queryRunner.query('ALTER TABLE `songs` DROP COLUMN `dalcom_song_filename`');
    await queryRunner.query('ALTER TABLE `songs` DROP INDEX `IDX_f83bd453948597ddc46f2b4bb9`');
    await queryRunner.query('ALTER TABLE `songs` DROP COLUMN `dalcom_song_id`');
    await queryRunner.query('DROP INDEX `IDX_83862467ad0a3afd66f49af374` ON `song_beatmaps`');
    await queryRunner.query('DROP INDEX `IDX_c8d12ea5178e0709deb03433d8` ON `song_beatmaps`');
    await queryRunner.query('DROP TABLE `song_beatmaps`');
  }

}
