import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddToUserVerifications1621096715087 implements MigrationInterface {
  name = 'AddToUserVerifications1621096715087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `users_verifications` ADD `intent` varchar(50) NOT NULL DEFAULT 'verify-account' AFTER `codeHash`",
    );
    await queryRunner.query('ALTER TABLE `users_verifications` CHANGE COLUMN `intent` `intent` varchar(50) NOT NULL');
    await queryRunner.query('ALTER TABLE `users_verifications` ADD `expire` datetime NULL AFTER `completed`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users_verifications` DROP COLUMN `expire`');
    await queryRunner.query('ALTER TABLE `users_verifications` DROP COLUMN `intent`');
  }
}
