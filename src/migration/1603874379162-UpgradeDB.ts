import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpgradeDB1603874379162 implements MigrationInterface {
  name = 'UpgradeDB1603874379162';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `player_profile_nicknames` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `nickname` varchar(255) NOT NULL, `profileId` int UNSIGNED NOT NULL, `date` datetime NULL, `guid` varchar(255) NOT NULL, INDEX `byNickname` (`nickname`), INDEX `byDate` (`date`), UNIQUE INDEX `IDX_71ab1e74608c872ee09af63317` (`guid`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `player_profile_images` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `profileId` int UNSIGNED NOT NULL, `profileImage` int UNSIGNED NOT NULL, `date` datetime NULL, `guid` varchar(255) NOT NULL, `leaderCardCard_image` int UNSIGNED NULL, `leaderCardGrade` varchar(5) NULL, `leaderCardLevel` smallint UNSIGNED NULL, INDEX `byDate` (`date`), UNIQUE INDEX `IDX_8e4c6332be5f542e7db3f14e14` (`guid`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      "CREATE TABLE `player_profiles` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `nickname` varchar(255) NOT NULL COMMENT 'the current nickname', `objectID` int UNSIGNED NULL, `specialUserCode` int UNSIGNED NULL DEFAULT 0, `divisionGroup` tinyint UNSIGNED NULL COMMENT 'in SSRGs the divisions are divided into two groups', `isSSRGDiscord` tinyint(1) UNSIGNED NOT NULL DEFAULT 0, `dateFirstObserved` datetime NULL, `dateReportedRegistration` datetime NULL, `gameId` int UNSIGNED NOT NULL, `guid` varchar(255) NOT NULL, `dateRegistered` datetime NULL, INDEX `byNickname` (`nickname`), INDEX `byObjectID` (`objectID`), INDEX `bySSRGDiscord` (`isSSRGDiscord`), INDEX `byDateFirstObserved` (`dateFirstObserved`), INDEX `byDateReportedRegistration` (`dateReportedRegistration`), INDEX `byDateRegistered` (`dateRegistered`), UNIQUE INDEX `IDX_6e575941a0e824087375ecdb5f` (`objectID`, `gameId`), UNIQUE INDEX `IDX_8ebc64a691c58259c1fe8c821c` (`guid`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'CREATE TABLE `superstar_games_populations` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `population` int UNSIGNED NOT NULL, `date` datetime NOT NULL, `gameId` int UNSIGNED NOT NULL, `guid` varchar(255) NOT NULL, INDEX `byDate` (`date`), UNIQUE INDEX `IDX_a9736ddd490a1621cb3854102b` (`guid`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );

    await queryRunner.query('ALTER TABLE `league_tracker` ADD `profileId` int UNSIGNED NULL');
    await queryRunner.query('ALTER TABLE `song_world_records` ADD `profileId` int UNSIGNED NULL');
    await queryRunner.query('ALTER TABLE `users_logins` ADD `meta` json NULL');
    await queryRunner.query('ALTER TABLE `superstar_games` ADD `dateReleased` date NULL');
    await queryRunner.query('ALTER TABLE `superstar_games` ADD `hasPrism` tinyint UNSIGNED NOT NULL DEFAULT 0');
    await queryRunner.query(
      'ALTER TABLE `superstar_games` ADD `isSingleArtistGame` tinyint UNSIGNED NOT NULL DEFAULT 0',
    );
    await queryRunner.query("ALTER TABLE `superstar_games` ADD `xpSystem` varchar(255) NOT NULL DEFAULT 'common'");
    await queryRunner.query('ALTER TABLE `artists` ADD `sort` int NULL');
    await queryRunner.query(
      "ALTER TABLE `artists` ADD `group` varchar(255) NULL COMMENT 'to group e.g. the NCT units under NCT'",
    );
    await queryRunner.query('ALTER TABLE `artists` ADD `imageId` varchar(255) NULL DEFAULT NULL');
    await queryRunner.query('ALTER TABLE `artists` ADD `dateDebut` datetime NULL');
    await queryRunner.query('ALTER TABLE `artists_members` ADD `dateBirthday` datetime NULL');
    await queryRunner.query('ALTER TABLE `songs` ADD `swrStatHighscore` int UNSIGNED NULL');
    await queryRunner.query('ALTER TABLE `songs` ADD `swrStatMin` int UNSIGNED NULL');
    await queryRunner.query('ALTER TABLE `songs` ADD `swrStatMean` int UNSIGNED NULL');
    await queryRunner.query('ALTER TABLE `songs` ADD `swrStatMedian` int UNSIGNED NULL');

    await queryRunner.query('CREATE INDEX `byDateDebut` ON `artists` (`dateDebut`)');
    await queryRunner.query('CREATE INDEX `byDateBirthday` ON `artists_members` (`dateBirthday`)');
    await queryRunner.query(
      'ALTER TABLE `player_profile_nicknames` ADD CONSTRAINT `FK_4c610a25fa7ee569d8ef1432b39` FOREIGN KEY (`profileId`) REFERENCES `player_profiles`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `player_profile_images` ADD CONSTRAINT `FK_b88087eafab3747821520e852dc` FOREIGN KEY (`profileId`) REFERENCES `player_profiles`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `player_profiles` ADD CONSTRAINT `FK_887adb9d555b50e3909d713f30d` FOREIGN KEY (`gameId`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `league_tracker` ADD CONSTRAINT `FK_c25b591527001a723e92df13d94` FOREIGN KEY (`profileId`) REFERENCES `player_profiles`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `song_world_records` ADD CONSTRAINT `FK_23476a4ef9023592d8b960f643a` FOREIGN KEY (`profileId`) REFERENCES `player_profiles`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `superstar_games_populations` ADD CONSTRAINT `FK_56cb7bb50557527fea11e2a2b99` FOREIGN KEY (`gameId`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `superstar_games_populations` DROP FOREIGN KEY `FK_56cb7bb50557527fea11e2a2b99`',
    );
    await queryRunner.query('ALTER TABLE `player_profiles` DROP FOREIGN KEY `FK_887adb9d555b50e3909d713f30d`');
    await queryRunner.query('ALTER TABLE `player_profile_images` DROP FOREIGN KEY `FK_b88087eafab3747821520e852dc`');
    await queryRunner.query('ALTER TABLE `player_profile_nicknames` DROP FOREIGN KEY `FK_4c610a25fa7ee569d8ef1432b39`');
    await queryRunner.query('ALTER TABLE `league_tracker` DROP FOREIGN KEY `FK_c25b591527001a723e92df13d94`');
    await queryRunner.query('ALTER TABLE `song_world_records` DROP FOREIGN KEY `FK_23476a4ef9023592d8b960f643a`');

    await queryRunner.query('DROP INDEX `byDateDebut` ON `artists`');
    await queryRunner.query('DROP INDEX `byDateBirthday` ON `artists_members`');

    await queryRunner.query('ALTER TABLE `artists_members` DROP COLUMN `dateBirthday`');
    await queryRunner.query('ALTER TABLE `artists` DROP COLUMN `dateDebut`');
    await queryRunner.query('ALTER TABLE `artists` DROP COLUMN `imageId`');
    await queryRunner.query('ALTER TABLE `artists` DROP COLUMN `sort`');
    await queryRunner.query('ALTER TABLE `artists` DROP COLUMN `group`');
    await queryRunner.query('ALTER TABLE `superstar_games` DROP COLUMN `xpSystem`');
    await queryRunner.query('ALTER TABLE `superstar_games` DROP COLUMN `isSingleArtistGame`');
    await queryRunner.query('ALTER TABLE `superstar_games` DROP COLUMN `hasPrism`');
    await queryRunner.query('ALTER TABLE `superstar_games` DROP COLUMN `dateReleased`');
    await queryRunner.query('ALTER TABLE `users_logins` DROP COLUMN `meta`');
    await queryRunner.query('ALTER TABLE `song_world_records` DROP COLUMN `profileId`');
    await queryRunner.query('ALTER TABLE `league_tracker` DROP COLUMN `profileId`');
    await queryRunner.query('ALTER TABLE `songs` DROP COLUMN `swrStatMedian`');
    await queryRunner.query('ALTER TABLE `songs` DROP COLUMN `swrStatMean`');
    await queryRunner.query('ALTER TABLE `songs` DROP COLUMN `swrStatMin`');
    await queryRunner.query('ALTER TABLE `songs` DROP COLUMN `swrStatHighscore`');

    await queryRunner.query('DROP INDEX `IDX_a9736ddd490a1621cb3854102b` ON `superstar_games_populations`');
    await queryRunner.query('DROP INDEX `byDate` ON `superstar_games_populations`');
    await queryRunner.query('DROP TABLE `superstar_games_populations`');
    await queryRunner.query('DROP INDEX `IDX_8ebc64a691c58259c1fe8c821c` ON `player_profiles`');
    await queryRunner.query('DROP INDEX `IDX_6e575941a0e824087375ecdb5f` ON `player_profiles`');
    await queryRunner.query('DROP INDEX `byDateRegistered` ON `player_profiles`');
    await queryRunner.query('DROP INDEX `byDateReportedRegistration` ON `player_profiles`');
    await queryRunner.query('DROP INDEX `byDateFirstObserved` ON `player_profiles`');
    await queryRunner.query('DROP INDEX `bySSRGDiscord` ON `player_profiles`');
    await queryRunner.query('DROP INDEX `byObjectID` ON `player_profiles`');
    await queryRunner.query('DROP INDEX `byNickname` ON `player_profiles`');
    await queryRunner.query('DROP TABLE `player_profiles`');
    await queryRunner.query('DROP INDEX `IDX_8e4c6332be5f542e7db3f14e14` ON `player_profile_images`');
    await queryRunner.query('DROP INDEX `byDate` ON `player_profile_images`');
    await queryRunner.query('DROP TABLE `player_profile_images`');
    await queryRunner.query('DROP INDEX `IDX_71ab1e74608c872ee09af63317` ON `player_profile_nicknames`');
    await queryRunner.query('DROP INDEX `byDate` ON `player_profile_nicknames`');
    await queryRunner.query('DROP INDEX `byNickname` ON `player_profile_nicknames`');
    await queryRunner.query('DROP TABLE `player_profile_nicknames`');
  }
}
