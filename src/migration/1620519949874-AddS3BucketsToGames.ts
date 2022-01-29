import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddS3BucketsToGames1620519949874 implements MigrationInterface {
  name = 'AddS3BucketsToGames1620519949874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `superstar_games` ADD `s3Buckets` text NOT NULL DEFAULT ''");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `superstar_games` DROP COLUMN `s3Buckets`');
  }
}
