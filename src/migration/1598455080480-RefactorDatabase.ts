import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorDatabase1598455080480 implements MigrationInterface {
  name = 'RefactorDatabase1598455080480';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE `world_record_seasons` (`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, `dateStart` datetime NOT NULL, `dateEnd` datetime NOT NULL, `comment` varchar(255) NULL, `meta` longtext NULL, `guid` varchar(255) NULL, `gameId` int UNSIGNED NULL, INDEX `byDateStart` (`dateStart`), INDEX `byDateEnd` (`dateEnd`), UNIQUE INDEX `IDX_59989b14ac935e94296e0e0dfe` (`guid`), PRIMARY KEY (`id`)) ENGINE=InnoDB');
    await queryRunner.query('CREATE TABLE `superstar_games_divisions_divisions` (`superstarGamesId` int(11) UNSIGNED NOT NULL, `divisionsId` int(11) UNSIGNED NOT NULL, INDEX `IDX_25515b286c164bb61109d758f3` (`superstarGamesId`), INDEX `IDX_02603de00d1dac25aa00e533ce` (`divisionsId`), PRIMARY KEY (`superstarGamesId`, `divisionsId`)) ENGINE=InnoDB');

    await queryRunner.query(`INSERT INTO world_record_seasons
    (dateStart, dateEnd, gameId)
    SELECT '2020-08-05T09:00:00' AS dateStart, '2020-09-30T06:00:00' AS dateEnd, id AS gameId
    FROM superstar_games
    ORDER BY id ASC `);

    await queryRunner.query('ALTER TABLE `song_world_records` ADD `season_id` int(11) UNSIGNED NOT NULL DEFAULT 1');
    await queryRunner.query('ALTER TABLE `songs` ADD `dateReleasedGame` datetime NOT NULL');
    await queryRunner.query('ALTER TABLE `songs` ADD `dateReleasedWorld` datetime NOT NULL');
    await queryRunner.query('ALTER TABLE `users` ADD `profilePublic` tinyint UNSIGNED NOT NULL DEFAULT 0');
    await queryRunner.query('ALTER TABLE `users` ADD `balancePublic` tinyint UNSIGNED NOT NULL DEFAULT 0');
    await queryRunner.query('ALTER TABLE `users` ADD `dropsPublic` tinyint UNSIGNED NOT NULL DEFAULT 0');
    await queryRunner.query('ALTER TABLE `users` ADD `playsPublic` tinyint UNSIGNED NOT NULL DEFAULT 0');
    await queryRunner.query('ALTER TABLE `themes` ADD `tags` text NOT NULL COMMENT \'contains theme tags like "Limited", "Event", "Original"\'');
    await queryRunner.query('ALTER TABLE `themes` ADD `prismMap` text NOT NULL COMMENT \'maps card IDs to prism and prism background and frame\'');
    await queryRunner.query('ALTER TABLE `themes` ADD `dateReleased` datetime NOT NULL');
    await queryRunner.query('ALTER TABLE `superstar_games` ADD `tagline` varchar(255) NOT NULL');
    await queryRunner.query('ALTER TABLE `superstar_games` ADD `active` tinyint UNSIGNED NOT NULL COMMENT \'whether this entry is active in the application and should be displayed and interacted with\' DEFAULT 1');

    await queryRunner.query('CREATE INDEX `byDateRecorded` ON `song_world_records` (`date_recorded`)');
    await queryRunner.query('CREATE INDEX `byDateReleasedGame` ON `songs` (`dateReleasedGame`)');
    await queryRunner.query('CREATE INDEX `byDateReleasedWorld` ON `songs` (`dateReleasedWorld`)');
    await queryRunner.query('CREATE INDEX `byDate` ON `log_credits` (`date`)');
    await queryRunner.query('CREATE INDEX `byType` ON `log_credits` (`event_type`)');
    await queryRunner.query('CREATE INDEX `byDate` ON `log_diamonds` (`date`)');
    await queryRunner.query('CREATE INDEX `byType` ON `log_diamonds` (`event_type`)');
    await queryRunner.query('CREATE INDEX `byAmount` ON `log_diamonds_ads` (`amount`)');
    await queryRunner.query('CREATE INDEX `byDate` ON `log_diamonds_ads` (`date`)');
    await queryRunner.query('CREATE INDEX `byDateReleased` ON `themes` (`dateReleased`)');
    await queryRunner.query('CREATE INDEX `byDate` ON `song_clears_v2` (`date`)');
    await queryRunner.query('CREATE INDEX `byHitMiss` ON `song_clears_v2` (`hit_miss`)');
    await queryRunner.query('CREATE INDEX `byDate` ON `league_ranking` (`date`)');
    await queryRunner.query('CREATE INDEX `byKey` ON `superstar_games` (`key`)');
    await queryRunner.query('CREATE INDEX `bySource` ON `log_drops` (`source`)');
    await queryRunner.query('CREATE INDEX `byType` ON `log_drops` (`type`)');
    await queryRunner.query('CREATE INDEX `byDate` ON `log_drops` (`date`)');
    await queryRunner.query('CREATE INDEX `byPrism` ON `log_drops` (`is_prism`)');

    await queryRunner.query('ALTER TABLE `world_record_seasons` ADD CONSTRAINT `FK_954b6470e824ceb15dda0c02567` FOREIGN KEY (`gameId`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT');
    await queryRunner.query('ALTER TABLE `song_world_records` ADD CONSTRAINT `FK_6a49a1d05b2e4b03fd5de359e51` FOREIGN KEY (`season_id`) REFERENCES `world_record_seasons`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT');
    await queryRunner.query('ALTER TABLE `superstar_games_divisions_divisions` ADD CONSTRAINT `FK_25515b286c164bb61109d758f3b` FOREIGN KEY (`superstarGamesId`) REFERENCES `superstar_games`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE `superstar_games_divisions_divisions` ADD CONSTRAINT `FK_02603de00d1dac25aa00e533ce0` FOREIGN KEY (`divisionsId`) REFERENCES `divisions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `superstar_games_divisions_divisions` DROP FOREIGN KEY `FK_02603de00d1dac25aa00e533ce0`');
    await queryRunner.query('ALTER TABLE `superstar_games_divisions_divisions` DROP FOREIGN KEY `FK_25515b286c164bb61109d758f3b`');

    await queryRunner.query('ALTER TABLE `song_world_records` DROP FOREIGN KEY `FK_6a49a1d05b2e4b03fd5de359e51`');
    await queryRunner.query('ALTER TABLE `world_record_seasons` DROP FOREIGN KEY `FK_954b6470e824ceb15dda0c02567`');

    await queryRunner.query('DROP INDEX `byPrism` ON `log_drops`');
    await queryRunner.query('DROP INDEX `byDate` ON `log_drops`');
    await queryRunner.query('DROP INDEX `byType` ON `log_drops`');
    await queryRunner.query('DROP INDEX `bySource` ON `log_drops`');
    await queryRunner.query('DROP INDEX `byKey` ON `superstar_games`');
    await queryRunner.query('DROP INDEX `byDate` ON `league_ranking`');
    await queryRunner.query('DROP INDEX `byHitMiss` ON `song_clears_v2`');
    await queryRunner.query('DROP INDEX `byDate` ON `song_clears_v2`');
    await queryRunner.query('DROP INDEX `IDX_4f9d43eacf66b2187dc3a4d3e6` ON `song_clear_cards`');
    await queryRunner.query('DROP INDEX `byDateReleased` ON `themes`');
    await queryRunner.query('DROP INDEX `byDate` ON `log_diamonds_ads`');
    await queryRunner.query('DROP INDEX `byAmount` ON `log_diamonds_ads`');
    await queryRunner.query('DROP INDEX `byType` ON `log_diamonds`');
    await queryRunner.query('DROP INDEX `byDate` ON `log_diamonds`');
    await queryRunner.query('DROP INDEX `byType` ON `log_credits`');
    await queryRunner.query('DROP INDEX `byDate` ON `log_credits`');
    await queryRunner.query('DROP INDEX `byDateReleasedWorld` ON `songs`');
    await queryRunner.query('DROP INDEX `byDateReleasedGame` ON `songs`');
    await queryRunner.query('DROP INDEX `byDateRecorded` ON `song_world_records`');


    await queryRunner.query('ALTER TABLE `superstar_games` DROP COLUMN `active`');
    await queryRunner.query('ALTER TABLE `superstar_games` DROP COLUMN `tagline`');
    await queryRunner.query('ALTER TABLE `themes` DROP COLUMN `dateReleased`');
    await queryRunner.query('ALTER TABLE `themes` DROP COLUMN `prismMap`');
    await queryRunner.query('ALTER TABLE `themes` DROP COLUMN `tags`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `playsPublic`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `dropsPublic`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `balancePublic`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `profilePublic`');
    await queryRunner.query('ALTER TABLE `songs` DROP COLUMN `dateReleasedWorld`');
    await queryRunner.query('ALTER TABLE `songs` DROP COLUMN `dateReleasedGame`');
    await queryRunner.query('ALTER TABLE `song_world_records` DROP COLUMN `season_id`');

    await queryRunner.query('DROP INDEX `IDX_02603de00d1dac25aa00e533ce` ON `superstar_games_divisions_divisions`');
    await queryRunner.query('DROP INDEX `IDX_25515b286c164bb61109d758f3` ON `superstar_games_divisions_divisions`');
    await queryRunner.query('DROP TABLE `superstar_games_divisions_divisions`');

    await queryRunner.query('DROP INDEX `IDX_59989b14ac935e94296e0e0dfe` ON `world_record_seasons`');
    await queryRunner.query('DROP INDEX `byDateEnd` ON `world_record_seasons`');
    await queryRunner.query('DROP INDEX `byDateStart` ON `world_record_seasons`');
    await queryRunner.query('DROP TABLE `world_record_seasons`');
  }

}
