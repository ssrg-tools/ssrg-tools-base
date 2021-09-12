import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1599035851235 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user_credentials` ' +
        'ADD COLUMN `expired` DATETIME NULL DEFAULT NULL AFTER `updated` ' +
        "CHANGE COLUMN `metadata` `metadata` LONGTEXT NOT NULL DEFAULT '{}' COLLATE 'utf8mb4_bin' AFTER `keyData`",
    );
    await queryRunner.query(
      "ALTER TABLE `users` CHANGE COLUMN `email` `email` VARCHAR(255) NULL COLLATE 'utf8mb4_unicode_ci' AFTER `last_login`;",
    );
    await queryRunner.query(
      'ALTER TABLE `users`' +
        ' ADD COLUMN `isAdmin` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 AFTER `active`,' +
        ' ADD COLUMN `isMod` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 AFTER `isAdmin`;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // empty
  }
}
