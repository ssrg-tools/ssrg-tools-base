import { MigrationInterface, QueryRunner } from 'typeorm';

export class SyncWithTypeORM1597024245848 implements MigrationInterface {
  name = 'SyncWithTypeORM1597024245848';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `log_diamonds` DROP FOREIGN KEY `FK_log_diamonds_superstar_games`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds` DROP FOREIGN KEY `FK_log_diamonds_users`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds_ads` DROP FOREIGN KEY `FK_log_diamonds_ads_superstar_games`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds_ads` DROP FOREIGN KEY `FK_log_diamonds_ads_users`',
    );
    await queryRunner.query(
      'ALTER TABLE `songs` DROP FOREIGN KEY `FK_songs_superstar_games`',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` DROP FOREIGN KEY `FK__songs`',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` DROP FOREIGN KEY `FK_song_clears_v2_divisions`',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` DROP FOREIGN KEY `FK_song_clears_v2_users`',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clear_cards` DROP FOREIGN KEY `FK__song_clears_v2`',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clear_cards` DROP FOREIGN KEY `FK_song_clear_cards_themes`',
    );
    await queryRunner.query(
      'ALTER TABLE `themes` DROP FOREIGN KEY `FK_themes_superstar_games`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` DROP FOREIGN KEY `FK_log_drops_superstar_games`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` DROP FOREIGN KEY `FK_log_drops_themes`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` DROP FOREIGN KEY `FK_log_drops_users`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_credits` DROP FOREIGN KEY `FK_log_credits_superstar_games`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_credits` DROP FOREIGN KEY `FK_log_credits_users`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_credentials` DROP FOREIGN KEY `FK_user_credentials_users`',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` DROP FOREIGN KEY `FK__divisions`',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` DROP FOREIGN KEY `FK__users`',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` DROP FOREIGN KEY `FK_league_ranking_superstar_games`',
    );

    await queryRunner.query('DROP INDEX `guid` ON `log_diamonds`');
    await queryRunner.query('DROP INDEX `guid` ON `log_diamonds_ads`');
    await queryRunner.query('DROP INDEX `date` ON `log_diamonds_ads`');
    await queryRunner.query('DROP INDEX `guid` ON `songs`');
    await queryRunner.query('DROP INDEX `guid` ON `song_clears_v2`');
    await queryRunner.query(
      'DROP INDEX `song_clear_id_member` ON `song_clear_cards`',
    );
    await queryRunner.query('DROP INDEX `guid` ON `song_clear_cards`');
    await queryRunner.query('DROP INDEX `guid` ON `themes`');
    await queryRunner.query('DROP INDEX `guid` ON `log_drops`');
    await queryRunner.query('DROP INDEX `guid` ON `superstar_games`');
    await queryRunner.query('DROP INDEX `guid` ON `log_credits`');
    await queryRunner.query('DROP INDEX `guid` ON `user_credentials`');
    await queryRunner.query('DROP INDEX `username_UNIQUE` ON `users`');
    await queryRunner.query('DROP INDEX `id_UNIQUE` ON `users`');
    await queryRunner.query('DROP INDEX `BY_GUID` ON `users`');
    await queryRunner.query('DROP INDEX `guid` ON `league_ranking`');
    await queryRunner.query('DROP INDEX `guid` ON `divisions`');

    await queryRunner.query(
      'ALTER TABLE `log_diamonds` CHANGE `diff` `diff` int NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds` CHANGE `date` `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds` CHANGE `comment` `comment` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds` CHANGE `meta` `meta` longtext NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds` CHANGE `guid` `guid` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds_ads` CHANGE `id` `id` int UNSIGNED NOT NULL AUTO_INCREMENT',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds_ads` CHANGE `amount` `amount` int UNSIGNED NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds_ads` CHANGE `date` `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds_ads` CHANGE `guid` `guid` varchar(255) NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `songs` CHANGE `length_display` `length_display` varchar(255) NULL COMMENT 'length for display, e.g. 1:34'",
    );
    await queryRunner.query(
      "ALTER TABLE `songs` CHANGE `length_nominal` `length_nominal` decimal(10,3) NULL COMMENT 'length in (fractions of) minutes'",
    );
    await queryRunner.query(
      'ALTER TABLE `songs` CHANGE `guid` `guid` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `date` `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `rp_base` `rp_base` int UNSIGNED NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `rp_total` `rp_total` int UNSIGNED NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `rp_bonus` `rp_bonus` int UNSIGNED NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `score_total` `score_total` int UNSIGNED NOT NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `score_base` `score_base` int UNSIGNED NULL COMMENT 'this field can not be relied upon if hit_miss is not zero'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `score_rave_bonus` `score_rave_bonus` int UNSIGNED NULL COMMENT 'this field can not be relied upon if hit_miss is not zero'",
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `score_bonus` `score_bonus` int UNSIGNED NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `stars` `stars` int UNSIGNED NOT NULL DEFAULT 3',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `hit_super_perfect` `hit_super_perfect` int UNSIGNED NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `hit_perfect` `hit_perfect` int UNSIGNED NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `hit_good` `hit_good` int UNSIGNED NULL DEFAULT 0',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `hit_miss` `hit_miss` int UNSIGNED NULL DEFAULT 0',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` DROP COLUMN `hit_score`',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` ADD `hit_score` int AS (2 * COALESCE(`hit_super_perfect`, 0) + 1 * COALESCE(`hit_perfect`, 0) + 0.5 * COALESCE(`hit_good`, 0) + -10 * COALESCE(`hit_miss`, 0)) STORED after `hit_miss`',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `theme_level` `theme_level` int UNSIGNED NOT NULL DEFAULT 3',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `is_challenge` `is_challenge` tinyint UNSIGNED NOT NULL DEFAULT 0',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `has_bonus` `has_bonus` tinyint UNSIGNED NOT NULL DEFAULT 0',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `watched_ads` `watched_ads` tinyint UNSIGNED NOT NULL DEFAULT 1',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `theme_buff_bonus` `theme_buff_bonus` int UNSIGNED NOT NULL DEFAULT 5000',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `score_theme_grade_bonus` `score_theme_grade_bonus` int UNSIGNED NOT NULL DEFAULT 545000',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `guid` `guid` varchar(255) NULL',
    );
    await queryRunner.query(
      'DROP INDEX `song_clear_id_rotation_order` ON `song_clear_cards`',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clear_cards` CHANGE `rotation_order` `rotation_order` smallint UNSIGNED NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clear_cards` CHANGE `score` `score` int UNSIGNED NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clear_cards` CHANGE `theme_id` `theme_id` int UNSIGNED NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clear_cards` CHANGE `level` `level` smallint UNSIGNED NULL DEFAULT 1',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clear_cards` CHANGE `is_prism` `is_prism` tinyint UNSIGNED NOT NULL DEFAULT 0',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clear_cards` CHANGE `guid` `guid` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `themes` CHANGE `guid` `guid` varchar(255) NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `log_drops` CHANGE `source` `source` enum ('Purchase (Diamonds)', 'Purchase (RP)', 'Purchase ($$$)', 'Reward', 'Challenge', 'Clear') NOT NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` CHANGE `type` `type` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` CHANGE `theme_id` `theme_id` int UNSIGNED NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` CHANGE `date` `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP',
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` CHANGE `is_prism` `is_prism` tinyint UNSIGNED NOT NULL DEFAULT 0',
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` CHANGE `comment` `comment` text NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` CHANGE `guid` `guid` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `superstar_games` CHANGE `comment` `comment` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `superstar_games` CHANGE `meta` `meta` longtext NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `superstar_games` CHANGE `guid` `guid` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `log_credits` CHANGE `diff` `diff` int NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `log_credits` CHANGE `date` `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP',
    );
    await queryRunner.query(
      'ALTER TABLE `log_credits` CHANGE `comment` `comment` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `log_credits` CHANGE `meta` `meta` longtext NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `log_credits` CHANGE `guid` `guid` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user_credentials` CHANGE `guid` `guid` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user_credentials` CHANGE `subtype` `subtype` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user_credentials` CHANGE `keyData` `keyData` blob NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user_credentials` CHANGE `created` `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP',
    );
    await queryRunner.query(
      'ALTER TABLE `user_credentials` CHANGE `updated` `updated` datetime NULL DEFAULT CURRENT_TIMESTAMP',
    );
    await queryRunner.query(
      'ALTER TABLE `users` CHANGE `created` `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP',
    );
    await queryRunner.query(
      'ALTER TABLE `users` CHANGE `modified` `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP',
    );
    await queryRunner.query(
      'ALTER TABLE `users` CHANGE `last_login` `last_login` datetime NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` CHANGE `diff_above` `diff_above` int UNSIGNED NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` CHANGE `diff_below` `diff_below` int UNSIGNED NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` CHANGE `score_above` `score_above` int AS (`score` + `diff_above`) STORED',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` CHANGE `score_below` `score_below` int AS (`score` - `diff_below`) STORED',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` CHANGE `date` `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` CHANGE `comment` `comment` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` CHANGE `meta` `meta` longtext NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` CHANGE `guid` `guid` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `divisions` CHANGE `group` `group` enum ' +
        "('Bronze', 'Silver', 'Gold', 'Platinum') NOT NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `divisions` CHANGE `rp_bonus` `rp_bonus` decimal(2,1) NOT NULL DEFAULT 0',
    );
    await queryRunner.query(
      'ALTER TABLE `divisions` CHANGE `order` `order` int UNSIGNED NOT NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `divisions` CHANGE `group_order` `group_order` int UNSIGNED NOT NULL COMMENT 'order within the group'",
    );
    await queryRunner.query(
      'ALTER TABLE `divisions` CHANGE `guid` `guid` varchar(255) NULL',
    );

    await queryRunner.query(
      'ALTER TABLE `log_diamonds` ADD UNIQUE INDEX `IDX_2fe79e293ab449c3e4dda6441b` (`guid`)',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds_ads` ADD UNIQUE INDEX `IDX_b97ae8ee43cd435b34770e94b6` (`guid`)',
    );
    await queryRunner.query(
      'ALTER TABLE `songs` ADD UNIQUE INDEX `IDX_4d4fd12607aa4504278b13756e` (`guid`)',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` ADD UNIQUE INDEX `IDX_3c46c21dbb9348cd14ac56c8d4` (`guid`)',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clear_cards` ADD UNIQUE INDEX `IDX_a38e398020144d70a45cece20f` (`guid`)',
    );
    await queryRunner.query(
      'ALTER TABLE `themes` ADD UNIQUE INDEX `IDX_7b34bebe65de0433edde822314` (`guid`)',
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` ADD UNIQUE INDEX `IDX_c1dd0e6468046daff5c9572284` (`guid`)',
    );
    await queryRunner.query(
      'ALTER TABLE `superstar_games` ADD UNIQUE INDEX `IDX_2b5757f76b059573f2ecc32b14` (`guid`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user_credentials` ADD UNIQUE INDEX `IDX_80ed621bafa50cba2f4aa1aa04` (`guid`)',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD UNIQUE INDEX `IDX_a3ffb1c0c8416b9fc6f907b743` (`id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD UNIQUE INDEX `IDX_fe0bb3f6520ee0469504521e71` (`username`)',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD UNIQUE INDEX `IDX_cea63fa5bf2ee74c27a01f6155` (`guid`)',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` ADD UNIQUE INDEX `IDX_b8620a50964c208cffe9b162ae` (`guid`)',
    );
    await queryRunner.query(
      'ALTER TABLE `divisions` ADD UNIQUE INDEX `IDX_3a9ea114f916b6714dbf4092bc` (`guid`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_58adef9aedebd662b88506583f` ON `log_diamonds` (`game_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_80a98de140c38f1ed48b486570` ON `log_diamonds` (`user_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_9402b99a15239b95309864535f` ON `log_diamonds_ads` (`game_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_994987d0bdbd132c351dc863a6` ON `log_diamonds_ads` (`user_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_8fcb2c96a7b43862c2a1a19c28` ON `log_diamonds_ads` (`date`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_ab62eccd228dff0992fcb44f05` ON `songs` (`game_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_390b24af470bafbd41bd092b62` ON `song_clears_v2` (`user_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_9be7492417d7ba450d31b0a8a2` ON `song_clears_v2` (`division_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_77e940a36ec0d2880e9abd1381` ON `song_clears_v2` (`song_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_5d02077d4941019273995220b5` ON `song_clear_cards` (`theme_id`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_4f9d43eacf66b2187dc3a4d3e6` ON `song_clear_cards` ' +
        '(`song_clear_id`, `rotation_order`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_f62dd5d3f81795ad257e35c5d4` ON `song_clear_cards` (`song_clear_id`, `member`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_200c5368f75e3f5fab815d2ba2` ON `themes` (`game_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_7b72c0e6f5438539635fa2706d` ON `log_drops` (`game_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_cc926133c401ae5e4c6cb943ee` ON `log_drops` (`user_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_2081b465971c6e81d5447e0f65` ON `log_drops` (`theme_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_e0a817b68f55d95f6721267439` ON `log_credits` (`game_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_c619094b8afd1e48d28b6ee9f7` ON `log_credits` (`user_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_dd0918407944553611bb3eb3dd` ON `user_credentials` (`user_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_ca78e5c3139a364014b4d4e9c3` ON `league_ranking` (`game_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_e0232f0a6acb95a3e1db0fd24c` ON `league_ranking` (`user_id`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_026f5a13d2660022d8093e4952` ON `league_ranking` (`division_id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds` ADD CONSTRAINT `FK_58adef9aedebd662b88506583f5` FOREIGN KEY (`game_id`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds` ADD CONSTRAINT `FK_80a98de140c38f1ed48b4865701` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds_ads` ADD CONSTRAINT `FK_9402b99a15239b95309864535f0` FOREIGN KEY (`game_id`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds_ads` ADD CONSTRAINT `FK_994987d0bdbd132c351dc863a6f` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `songs` ADD CONSTRAINT `FK_ab62eccd228dff0992fcb44f059` FOREIGN KEY (`game_id`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` ADD CONSTRAINT `FK_77e940a36ec0d2880e9abd13812` FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` ADD CONSTRAINT `FK_9be7492417d7ba450d31b0a8a23` FOREIGN KEY (`division_id`) REFERENCES `divisions`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` ADD CONSTRAINT `FK_390b24af470bafbd41bd092b62e` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clear_cards` ADD CONSTRAINT `FK_4f894ee4688c203e90c4c813356` FOREIGN KEY (`song_clear_id`) REFERENCES `song_clears_v2`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clear_cards` ADD CONSTRAINT `FK_5d02077d4941019273995220b5d` FOREIGN KEY (`theme_id`) REFERENCES `themes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `themes` ADD CONSTRAINT `FK_200c5368f75e3f5fab815d2ba2d` FOREIGN KEY (`game_id`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` ADD CONSTRAINT `FK_7b72c0e6f5438539635fa2706d9` FOREIGN KEY (`game_id`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` ADD CONSTRAINT `FK_2081b465971c6e81d5447e0f655` FOREIGN KEY (`theme_id`) REFERENCES `themes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` ADD CONSTRAINT `FK_cc926133c401ae5e4c6cb943eee` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `log_credits` ADD CONSTRAINT `FK_e0a817b68f55d95f67212674391` FOREIGN KEY (`game_id`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `log_credits` ADD CONSTRAINT `FK_c619094b8afd1e48d28b6ee9f73` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `user_credentials` ADD CONSTRAINT `FK_dd0918407944553611bb3eb3ddc` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` ADD CONSTRAINT `FK_026f5a13d2660022d8093e4952a` FOREIGN KEY (`division_id`) REFERENCES `divisions`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` ADD CONSTRAINT `FK_e0232f0a6acb95a3e1db0fd24c5` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` ADD CONSTRAINT `FK_ca78e5c3139a364014b4d4e9c34` FOREIGN KEY (`game_id`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `league_ranking` DROP FOREIGN KEY `FK_ca78e5c3139a364014b4d4e9c34`',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` DROP FOREIGN KEY `FK_e0232f0a6acb95a3e1db0fd24c5`',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` DROP FOREIGN KEY `FK_026f5a13d2660022d8093e4952a`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_credentials` DROP FOREIGN KEY `FK_dd0918407944553611bb3eb3ddc`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_credits` DROP FOREIGN KEY `FK_c619094b8afd1e48d28b6ee9f73`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_credits` DROP FOREIGN KEY `FK_e0a817b68f55d95f67212674391`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` DROP FOREIGN KEY `FK_cc926133c401ae5e4c6cb943eee`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` DROP FOREIGN KEY `FK_2081b465971c6e81d5447e0f655`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` DROP FOREIGN KEY `FK_7b72c0e6f5438539635fa2706d9`',
    );
    await queryRunner.query(
      'ALTER TABLE `themes` DROP FOREIGN KEY `FK_200c5368f75e3f5fab815d2ba2d`',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clear_cards` DROP FOREIGN KEY `FK_5d02077d4941019273995220b5d`',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clear_cards` DROP FOREIGN KEY `FK_4f894ee4688c203e90c4c813356`',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` DROP FOREIGN KEY `FK_390b24af470bafbd41bd092b62e`',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` DROP FOREIGN KEY `FK_9be7492417d7ba450d31b0a8a23`',
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` DROP FOREIGN KEY `FK_77e940a36ec0d2880e9abd13812`',
    );
    await queryRunner.query(
      'ALTER TABLE `songs` DROP FOREIGN KEY `FK_ab62eccd228dff0992fcb44f059`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds_ads` DROP FOREIGN KEY `FK_994987d0bdbd132c351dc863a6f`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds_ads` DROP FOREIGN KEY `FK_9402b99a15239b95309864535f0`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds` DROP FOREIGN KEY `FK_80a98de140c38f1ed48b4865701`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds` DROP FOREIGN KEY `FK_58adef9aedebd662b88506583f5`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_026f5a13d2660022d8093e4952` ON `league_ranking`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_e0232f0a6acb95a3e1db0fd24c` ON `league_ranking`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_ca78e5c3139a364014b4d4e9c3` ON `league_ranking`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_dd0918407944553611bb3eb3dd` ON `user_credentials`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_c619094b8afd1e48d28b6ee9f7` ON `log_credits`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_e0a817b68f55d95f6721267439` ON `log_credits`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_2081b465971c6e81d5447e0f65` ON `log_drops`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_cc926133c401ae5e4c6cb943ee` ON `log_drops`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_7b72c0e6f5438539635fa2706d` ON `log_drops`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_200c5368f75e3f5fab815d2ba2` ON `themes`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_f62dd5d3f81795ad257e35c5d4` ON `song_clear_cards`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_4f9d43eacf66b2187dc3a4d3e6` ON `song_clear_cards`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_5d02077d4941019273995220b5` ON `song_clear_cards`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_77e940a36ec0d2880e9abd1381` ON `song_clears_v2`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_9be7492417d7ba450d31b0a8a2` ON `song_clears_v2`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_390b24af470bafbd41bd092b62` ON `song_clears_v2`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_ab62eccd228dff0992fcb44f05` ON `songs`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_8fcb2c96a7b43862c2a1a19c28` ON `log_diamonds_ads`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_994987d0bdbd132c351dc863a6` ON `log_diamonds_ads`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_9402b99a15239b95309864535f` ON `log_diamonds_ads`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_80a98de140c38f1ed48b486570` ON `log_diamonds`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_58adef9aedebd662b88506583f` ON `log_diamonds`',
    );
    await queryRunner.query(
      'ALTER TABLE `divisions` DROP INDEX `IDX_3a9ea114f916b6714dbf4092bc`',
    );
    await queryRunner.query(
      "ALTER TABLE `divisions` CHANGE `guid` `guid` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `divisions` CHANGE `group_order` `group_order` int(10) UNSIGNED NOT NULL COMMENT 'order within the group'",
    );
    await queryRunner.query(
      'ALTER TABLE `divisions` CHANGE `order` `order` int(10) UNSIGNED NOT NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `divisions` CHANGE `rp_bonus` `rp_bonus` decimal(2,1) NOT NULL DEFAULT '0.0'",
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` DROP INDEX `IDX_b8620a50964c208cffe9b162ae`',
    );
    await queryRunner.query(
      "ALTER TABLE `league_ranking` CHANGE `guid` `guid` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `league_ranking` CHANGE `meta` `meta` longtext NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `league_ranking` CHANGE `comment` `comment` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` CHANGE `date` `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` CHANGE `score_below` `score_below` int AS (`score` - `diff_below`) STORED',
    );
    await queryRunner.query(
      'ALTER TABLE `league_ranking` CHANGE `score_above` `score_above` int AS (`score` + `diff_above`) STORED',
    );
    await queryRunner.query(
      "ALTER TABLE `league_ranking` CHANGE `diff_below` `diff_below` int(10) UNSIGNED NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `league_ranking` CHANGE `diff_above` `diff_above` int(10) UNSIGNED NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      'ALTER TABLE `users` DROP INDEX `IDX_cea63fa5bf2ee74c27a01f6155`',
    );
    await queryRunner.query(
      "ALTER TABLE `users` CHANGE `last_login` `last_login` datetime NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      'ALTER TABLE `users` CHANGE `modified` `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()',
    );
    await queryRunner.query(
      'ALTER TABLE `users` CHANGE `created` `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()',
    );
    await queryRunner.query(
      'ALTER TABLE `users` DROP INDEX `IDX_fe0bb3f6520ee0469504521e71`',
    );
    await queryRunner.query(
      'ALTER TABLE `users` CHANGE `username` `username` varchar(100) COLLATE "utf8mb4_general_ci" NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `users` DROP INDEX `IDX_a3ffb1c0c8416b9fc6f907b743`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_credentials` CHANGE `updated` `updated` datetime NULL DEFAULT CURRENT_TIMESTAMP()',
    );
    await queryRunner.query(
      'ALTER TABLE `user_credentials` CHANGE `created` `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()',
    );
    await queryRunner.query(
      "ALTER TABLE `user_credentials` CHANGE `keyData` `keyData` blob NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `user_credentials` CHANGE `subtype` `subtype` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      'ALTER TABLE `user_credentials` DROP INDEX `IDX_80ed621bafa50cba2f4aa1aa04`',
    );
    await queryRunner.query(
      'ALTER TABLE `log_credits` DROP INDEX `IDX_078c7ad329b51a9ca50b30872c`',
    );
    await queryRunner.query(
      "ALTER TABLE `log_credits` CHANGE `guid` `guid` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `log_credits` CHANGE `meta` `meta` longtext NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `log_credits` CHANGE `comment` `comment` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      'ALTER TABLE `log_credits` CHANGE `date` `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()',
    );
    await queryRunner.query(
      "ALTER TABLE `log_credits` CHANGE `diff` `diff` int NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      'ALTER TABLE `superstar_games` DROP INDEX `IDX_2b5757f76b059573f2ecc32b14`',
    );
    await queryRunner.query(
      "ALTER TABLE `superstar_games` CHANGE `guid` `guid` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `superstar_games` CHANGE `meta` `meta` longtext NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `superstar_games` CHANGE `comment` `comment` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` DROP INDEX `IDX_c1dd0e6468046daff5c9572284`',
    );
    await queryRunner.query(
      "ALTER TABLE `log_drops` CHANGE `guid` `guid` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `log_drops` CHANGE `comment` `comment` text NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `log_drops` CHANGE `is_prism` `is_prism` tinyint(3) UNSIGNED NOT NULL DEFAULT '0'",
    );
    await queryRunner.query(
      'ALTER TABLE `log_drops` CHANGE `date` `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()',
    );
    await queryRunner.query(
      "ALTER TABLE `log_drops` CHANGE `theme_id` `theme_id` int(10) UNSIGNED NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `log_drops` CHANGE `type` `type` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `log_drops` CHANGE `source` `source` enum ('Purchase (Diamond') NOT NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `themes` DROP INDEX `IDX_7b34bebe65de0433edde822314`',
    );
    await queryRunner.query(
      "ALTER TABLE `themes` CHANGE `guid` `guid` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      'ALTER TABLE `song_clear_cards` DROP INDEX `IDX_a38e398020144d70a45cece20f`',
    );
    await queryRunner.query(
      "ALTER TABLE `song_clear_cards` CHANGE `guid` `guid` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clear_cards` CHANGE `is_prism` `is_prism` tinyint(3) UNSIGNED NOT NULL DEFAULT '0'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clear_cards` CHANGE `level` `level` smallint(5) UNSIGNED NULL DEFAULT '1'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clear_cards` CHANGE `theme_id` `theme_id` int(10) UNSIGNED NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      'ALTER TABLE `song_clear_cards` CHANGE `score` `score` int(10) UNSIGNED NOT NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `song_clear_cards` CHANGE `rotation_order` `rotation_order` smallint(5) UNSIGNED NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` DROP INDEX `IDX_3c46c21dbb9348cd14ac56c8d4`',
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `guid` `guid` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `score_theme_grade_bonus` `score_theme_grade_bonus` int(10) UNSIGNED NOT NULL DEFAULT '545000'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `theme_buff_bonus` `theme_buff_bonus` int(10) UNSIGNED NOT NULL DEFAULT '5000'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `watched_ads` `watched_ads` tinyint(3) UNSIGNED NOT NULL DEFAULT '1'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `has_bonus` `has_bonus` tinyint(3) UNSIGNED NOT NULL DEFAULT '0'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `is_challenge` `is_challenge` tinyint(3) UNSIGNED NOT NULL DEFAULT '0'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `theme_level` `theme_level` int(10) UNSIGNED NOT NULL DEFAULT '3'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `hit_miss` `hit_miss` int(10) UNSIGNED NULL DEFAULT '0'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `hit_good` `hit_good` int(10) UNSIGNED NULL DEFAULT '0'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `hit_perfect` `hit_perfect` int(10) UNSIGNED NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `hit_super_perfect` `hit_super_perfect` int(10) UNSIGNED NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `stars` `stars` int(10) UNSIGNED NOT NULL DEFAULT '3'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `score_bonus` `score_bonus` int(10) UNSIGNED NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `score_rave_bonus` `score_rave_bonus` int(10) UNSIGNED NULL COMMENT 'this field can not be relied upon if hit_miss is not zero' DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `score_base` `score_base` int(10) UNSIGNED NULL COMMENT 'this field can not be relied upon if hit_miss is not zero' DEFAULT 'NULL'",
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `score_total` `score_total` int(10) UNSIGNED NOT NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `rp_bonus` `rp_bonus` int(10) UNSIGNED NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `rp_total` `rp_total` int(10) UNSIGNED NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `song_clears_v2` CHANGE `rp_base` `rp_base` int(10) UNSIGNED NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      'ALTER TABLE `song_clears_v2` CHANGE `date` `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()',
    );
    await queryRunner.query(
      'ALTER TABLE `songs` DROP INDEX `IDX_4d4fd12607aa4504278b13756e`',
    );
    await queryRunner.query(
      "ALTER TABLE `songs` CHANGE `guid` `guid` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `songs` CHANGE `length_nominal` `length_nominal` decimal(10,3) NULL COMMENT 'length in (fractions of) minutes' DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `songs` CHANGE `length_display` `length_display` varchar(255) NULL COMMENT 'length for display, e.g. 1:34' DEFAULT 'NULL'",
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds_ads` DROP INDEX `IDX_b97ae8ee43cd435b34770e94b6`',
    );
    await queryRunner.query(
      "ALTER TABLE `log_diamonds_ads` CHANGE `guid` `guid` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds_ads` CHANGE `date` `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds_ads` CHANGE `amount` `amount` int(10) UNSIGNED NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds_ads` CHANGE `id` `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT',
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds` DROP INDEX `IDX_2fe79e293ab449c3e4dda6441b`',
    );
    await queryRunner.query(
      "ALTER TABLE `log_diamonds` CHANGE `guid` `guid` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `log_diamonds` CHANGE `meta` `meta` longtext NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      "ALTER TABLE `log_diamonds` CHANGE `comment` `comment` varchar(255) NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      'ALTER TABLE `log_diamonds` CHANGE `date` `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()',
    );
    await queryRunner.query(
      "ALTER TABLE `log_diamonds` CHANGE `diff` `diff` int NULL DEFAULT 'NULL'",
    );
    await queryRunner.query(
      'ALTER TABLE `superstar_games` DROP COLUMN `max_r_level`',
    );
    await queryRunner.query(
      'ALTER TABLE `songs` DROP COLUMN `beatmap_date_processed`',
    );
    await queryRunner.query(
      'ALTER TABLE `songs` DROP INDEX `IDX_a8d2f0f709399856f601de34c3`',
    );
    await queryRunner.query(
      'ALTER TABLE `songs` DROP COLUMN `beatmap_fingerprint`',
    );
    await queryRunner.query(
      'ALTER TABLE `songs` DROP INDEX `IDX_dcae9d25b142b942fff5fd4c83`',
    );
    await queryRunner.query(
      'ALTER TABLE `songs` DROP COLUMN `dalcom_song_filename`',
    );
    await queryRunner.query(
      'ALTER TABLE `songs` DROP INDEX `IDX_f83bd453948597ddc46f2b4bb9`',
    );
    await queryRunner.query('ALTER TABLE `songs` DROP COLUMN `dalcom_song_id`');
    await queryRunner.query(
      'CREATE UNIQUE INDEX `guid` ON `divisions` (`guid`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `guid` ON `league_ranking` (`guid`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `BY_GUID` ON `users` (`guid`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `id_UNIQUE` ON `users` (`id`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `username_UNIQUE` ON `users` (`username`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `guid` ON `user_credentials` (`guid`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `guid` ON `log_credits` (`guid`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `guid` ON `superstar_games` (`guid`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `guid` ON `log_drops` (`guid`)',
    );
    await queryRunner.query('CREATE UNIQUE INDEX `guid` ON `themes` (`guid`)');
    await queryRunner.query(
      'CREATE UNIQUE INDEX `guid` ON `song_clear_cards` (`guid`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `song_clear_id_member` ON `song_clear_cards` (`song_clear_id`, `member`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `guid` ON `song_clears_v2` (`guid`)',
    );
    await queryRunner.query('CREATE UNIQUE INDEX `guid` ON `songs` (`guid`)');
    await queryRunner.query(
      'CREATE INDEX `date` ON `log_diamonds_ads` (`date`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `guid` ON `log_diamonds_ads` (`guid`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `guid` ON `log_diamonds` (`guid`)',
    );
  }
}
