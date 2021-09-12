import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRawNoteCountToSongBeatmaps1605044347305
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `song_beatmaps` ADD `count_notes_total_raw` int UNSIGNED NOT NULL COMMENT 'including all bullshit from the beatmaps' AFTER `count_notes_total`",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `song_beatmaps` DROP COLUMN `count_notes_total_raw`',
    );
  }
}
