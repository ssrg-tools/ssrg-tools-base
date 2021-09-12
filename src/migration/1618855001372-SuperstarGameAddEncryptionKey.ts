import { MigrationInterface, QueryRunner } from 'typeorm';

export class SuperstarGameAddEncryptionKey1618855001372
  implements MigrationInterface {
  name = 'SuperstarGameAddEncryptionKey1618855001372';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `superstar_games` ADD `encryptionKey` varchar(255) NULL COMMENT 'game encryption key in clear text'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `superstar_games` DROP COLUMN `encryptionKey`',
    );
  }
}
