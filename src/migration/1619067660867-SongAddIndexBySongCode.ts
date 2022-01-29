import { MigrationInterface, QueryRunner } from 'typeorm';

export class SongAddIndexBySongCode1619067660867 implements MigrationInterface {
  name = 'SongAddIndexBySongCode1619067660867';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE INDEX `bySongCode` ON `songs` (`dalcom_song_id`)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `bySongCode` ON `songs`');
  }
}
