import { MigrationInterface, QueryRunner } from 'typeorm';

export class SongMaxRLevel1597072046532 implements MigrationInterface {
  name = 'SongMaxRLevel1597072046532';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `superstar_games` ADD `max_r_level` smallint UNSIGNED NULL DEFAULT 50 AFTER `name`',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `superstar_games` DROP COLUMN `max_r_level`',
    );
  }
}
