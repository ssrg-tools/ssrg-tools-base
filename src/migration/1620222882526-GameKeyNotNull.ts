import { MigrationInterface, QueryRunner } from "typeorm";

export class GameKeyNotNull1620222882526 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `superstar_games` CHANGE COLUMN `key` `key` VARCHAR(50) NOT NULL COMMENT 'used for urls and  internal tools' COLLATE 'utf8mb4_unicode_ci' AFTER `max_r_level`;");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `superstar_games` CHANGE COLUMN `key` `key` VARCHAR(50) NULL COMMENT 'used for urls and  internal tools' COLLATE 'utf8mb4_unicode_ci' AFTER `max_r_level`;");
  }

}
