import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddArtists1600345568347 implements MigrationInterface {
  name = 'AddArtists1600345568347';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `artists_members` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `artistId` int UNSIGNED NOT NULL, `name` varchar(255) NOT NULL, `memberOffset` tinyint UNSIGNED NOT NULL, `guid` varchar(255) NOT NULL, UNIQUE INDEX `IDX_cfcb0b72fa4ff195125caa885a` (`artistId`, `memberOffset`), UNIQUE INDEX `IDX_2611da3855f35b965103a1fc97` (`artistId`, `name`), UNIQUE INDEX `IDX_9db30a644f0db3919fd0c8dc29` (`guid`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `artists` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `cardCount` tinyint UNSIGNED NULL, `guid` varchar(255) NOT NULL, `gameId` int UNSIGNED NOT NULL, UNIQUE INDEX `IDX_70c3685e197743b963339d158c` (`name`), UNIQUE INDEX `IDX_502adb6bbe1506997cf6d1aeb1` (`guid`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query('ALTER TABLE `songs` ADD `artist_id` int UNSIGNED NULL');
    await queryRunner.query('ALTER TABLE `themes` ADD `artist_id` int UNSIGNED NULL');

    await queryRunner.query(
      'ALTER TABLE `songs` ADD CONSTRAINT `FK_999ba7dd3c94dd5f9649944a5c6` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `themes` ADD CONSTRAINT `FK_e4cb9c54007a543fca28c05cf93` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `artists` ADD CONSTRAINT `FK_2e2fda1dec4c9bc16704e9ff772` FOREIGN KEY (`gameId`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `artists` DROP FOREIGN KEY `FK_2e2fda1dec4c9bc16704e9ff772`');
    await queryRunner.query('ALTER TABLE `themes` DROP FOREIGN KEY `FK_e4cb9c54007a543fca28c05cf93`');
    await queryRunner.query('ALTER TABLE `songs` DROP FOREIGN KEY `FK_999ba7dd3c94dd5f9649944a5c6`');

    await queryRunner.query('ALTER TABLE `themes` DROP COLUMN `artist_id`');
    await queryRunner.query('ALTER TABLE `songs` DROP COLUMN `artist_id`');
    await queryRunner.query('DROP INDEX `IDX_502adb6bbe1506997cf6d1aeb1` ON `artists`');
    await queryRunner.query('DROP INDEX `IDX_70c3685e197743b963339d158c` ON `artists`');
    await queryRunner.query('DROP TABLE `artists`');
    await queryRunner.query('DROP INDEX `IDX_9db30a644f0db3919fd0c8dc29` ON `artists_members`');
    await queryRunner.query('DROP INDEX `IDX_2611da3855f35b965103a1fc97` ON `artists_members`');
    await queryRunner.query('DROP INDEX `IDX_cfcb0b72fa4ff195125caa885a` ON `artists_members`');
    await queryRunner.query('DROP TABLE `artists_members`');
  }
}
