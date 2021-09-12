import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSongWorldRecord1597150578591 implements MigrationInterface {
  name = 'AddSongWorldRecord1597150578591';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`song_world_records\` (
      \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
      \`song_id\` int UNSIGNED NOT NULL,
      \`object_id\` int UNSIGNED NOT NULL,
      \`special_user_code\` int UNSIGNED NOT NULL,
      \`nickname\` varchar(255) NOT NULL,
      \`profile_image\` int UNSIGNED NOT NULL,
      \`highscore\` int UNSIGNED NOT NULL,
      \`date_recorded\` datetime NOT NULL,
      \`meta\` longtext NOT NULL DEFAULT '{}',
      \`guid\` varchar(255) NULL,
      \`leaderCardCard_image\` int UNSIGNED NULL,
      \`leaderCardGrade\` varchar(5) NULL,
      \`leaderCardLevel\` smallint UNSIGNED NULL,
      INDEX \`IDX_78d80285e88cbbe7b7bab1c6b8\` (\`song_id\`),
      INDEX \`IDX_fefab589657440640cfda575fd\` (\`date_recorded\`),
      UNIQUE INDEX \`IDX_b5d5ba411f77be0ea054ddb88d\` (\`guid\`),
      PRIMARY KEY (\`id\`)
      )
      ENGINE=InnoDB`);
    await queryRunner.query(
      'ALTER TABLE `song_world_records` ADD CONSTRAINT `FK_78d80285e88cbbe7b7bab1c6b89` FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `song_world_records` DROP FOREIGN KEY `FK_78d80285e88cbbe7b7bab1c6b89`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_b5d5ba411f77be0ea054ddb88d` ON `song_world_records`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_fefab589657440640cfda575fd` ON `song_world_records`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_78d80285e88cbbe7b7bab1c6b8` ON `song_world_records`',
    );
    await queryRunner.query('DROP TABLE `song_world_records`');
  }
}
