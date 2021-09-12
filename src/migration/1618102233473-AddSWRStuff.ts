import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSWRStuff1618102233473 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `song_world_records` ADD `dateObserved` datetime NULL COMMENT 'date the entry has been observed, e.g. file date of the json' AFTER `date_recorded`, ADD `dateEntry` datetime NULL COMMENT 'date the entry has been entered into the database, e.g. time the script ran or the API call was received' AFTER `dateObserved`, ADD `observerUserId` int(11) unsigned NULL COMMENT 'date the entry has been entered into the database, e.g. time the script ran or the ' AFTER `leaderCardLevel`",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `song_world_records` DROP COLUMN `dateObserved`, DROP COLUMN `dateEntry`, DROP COLUMN `observerUserId`',
    );
  }
}
