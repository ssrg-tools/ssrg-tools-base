import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSongIdUniqueKey1598643898180 implements MigrationInterface {
  name = 'FixSongIdUniqueKey1598643898180';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_f83bd453948597ddc46f2b4bb9` ON `songs`',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_b8f348b612eb1b849cbc56b877` ON `songs` (`dalcom_song_id`, `game_id`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_b8f348b612eb1b849cbc56b877` ON `songs`',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_f83bd453948597ddc46f2b4bb9` ON `songs` (`dalcom_song_id`)',
    );
  }
}
