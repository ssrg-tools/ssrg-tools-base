import { MigrationInterface, QueryRunner } from 'typeorm';

export class RevampDB1599475866334 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE `users_active_games_superstar_games` (`usersId` int UNSIGNED NOT NULL, `superstarGamesId` int UNSIGNED NOT NULL, INDEX `IDX_249c319fce0d6f0d6bf84a0de9` (`usersId`), INDEX `IDX_73cd963bb92f6f0feed8a19349` (`superstarGamesId`), PRIMARY KEY (`usersId`, `superstarGamesId`)) ENGINE=InnoDB');

    await queryRunner.query('ALTER TABLE `songs` ADD `imageId` varchar(255) NULL COMMENT \'defaults to game internal song id\' DEFAULT NULL AFTER `dalcom_song_id`');
    await queryRunner.query('ALTER TABLE `songs` CHANGE `dateReleasedGame` `dateReleasedGame` datetime NULL');
    await queryRunner.query('ALTER TABLE `songs` CHANGE `dateReleasedWorld` `dateReleasedWorld` datetime NULL');

    await queryRunner.query('ALTER TABLE `song_clears_v2` CHANGE `theme_buff_bonus` `theme_buff_bonus` int UNSIGNED NULL DEFAULT 6000');
    await queryRunner.query('ALTER TABLE `song_clears_v2` CHANGE `score_theme_grade_bonus` `score_theme_grade_bonus` int UNSIGNED NULL DEFAULT 545000');

    await queryRunner.query('ALTER TABLE `song_clear_cards` CHANGE `member` `member` enum (\'Sowon\', \'Yerin\', \'Eunha\', \'Yuju\', \'SinB\', \'Umji\') NULL');

    await queryRunner.query('ALTER TABLE `themes` CHANGE `dateReleased` `dateReleased` datetime NULL');
    await queryRunner.query('ALTER TABLE `themes` DROP COLUMN `prismMap`');
    await queryRunner.query('ALTER TABLE `themes` ADD `frameId` int UNSIGNED NOT NULL COMMENT \'ID of the frame cards, for LE/Event cards\' DEFAULT 0');
    await queryRunner.query('ALTER TABLE `themes` ADD `prismId` int UNSIGNED NOT NULL COMMENT \'ID of the prism bg, GFriend prism cards\' DEFAULT 1');
    await queryRunner.query('ALTER TABLE `themes` ADD `cardIdStart` int UNSIGNED NULL');
    await queryRunner.query('ALTER TABLE `themes` ADD `cardCount` int UNSIGNED NULL');

    await queryRunner.query('ALTER TABLE `log_drops` CHANGE `member` `member` enum (\'Sowon\', \'Yerin\', \'Eunha\', \'Yuju\', \'SinB\', \'Umji\', \'Power Up\') NULL');

    await queryRunner.query('ALTER TABLE `league_ranking` CHANGE `user_id` `user_id` int UNSIGNED NULL DEFAULT 20150115');

    await queryRunner.query('ALTER TABLE `users_active_games_superstar_games` ADD CONSTRAINT `FK_249c319fce0d6f0d6bf84a0de9b` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE `users_active_games_superstar_games` ADD CONSTRAINT `FK_73cd963bb92f6f0feed8a193498` FOREIGN KEY (`superstarGamesId`) REFERENCES `superstar_games`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION');

    await queryRunner.query('UPDATE songs SET dateReleasedGame = NULL WHERE dateReleasedGame IN (\'2020-01-01 09:00:00\', \'0000-00-00 00:00:00\');');
    await queryRunner.query('UPDATE songs SET dateReleasedWorld = NULL WHERE dateReleasedWorld IN (\'2020-01-01 09:00:00\', \'0000-00-00 00:00:00\');');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // not supported
  }

}
