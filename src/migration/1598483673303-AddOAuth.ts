import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOAuth1598483673303 implements MigrationInterface {
  name = 'AddOAuth1598483673303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `oauth_codes` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `accessToken` varchar(255) NOT NULL, `accessTokenExpiration` datetime NOT NULL, `redirectUri` varchar(255) NULL, `guid` varchar(255) NULL, `clientId` int UNSIGNED NULL, `userId` int UNSIGNED NULL, UNIQUE INDEX `IDX_422fb58499f35099912d8df191` (`accessToken`), UNIQUE INDEX `IDX_1065caecafb63eab6c74d60814` (`guid`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `oauth_tokens` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `accessToken` varchar(255) NOT NULL, `accessTokenExpiration` datetime NOT NULL, `refreshToken` varchar(255) NOT NULL, `refreshTokenExpiration` datetime NOT NULL, `guid` varchar(255) NULL, `clientId` int UNSIGNED NULL, `userId` int UNSIGNED NULL, UNIQUE INDEX `IDX_d41d9ae6c789d78311f4375457` (`accessToken`), UNIQUE INDEX `IDX_7ca9fdd6a8b2fb6a457b745ab7` (`guid`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `oauth_clients` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `clientId` varchar(100) NOT NULL, `clientSecret` varchar(100) NOT NULL, `redirectUris` text NOT NULL, `grants` text NOT NULL, `guid` varchar(255) NULL, UNIQUE INDEX `IDX_b0c094fe1ef0a6c4af8f2b10be` (`clientId`), UNIQUE INDEX `IDX_eaa26672030dde4bbfe34a963d` (`clientSecret`), UNIQUE INDEX `IDX_62c7da4221e0387c13a5041f6d` (`guid`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );

    await queryRunner.query(
      'ALTER TABLE `oauth_codes` ADD CONSTRAINT `FK_1e80210c80509097733e5194bda` FOREIGN KEY (`clientId`) REFERENCES `oauth_clients`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `oauth_codes` ADD CONSTRAINT `FK_4dac391deea4c1f8d24a63107b2` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `oauth_tokens` ADD CONSTRAINT `FK_3d9dfb37837e5dd891bbc81b324` FOREIGN KEY (`clientId`) REFERENCES `oauth_clients`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `oauth_tokens` ADD CONSTRAINT `FK_a8c200cc4c90d24e832caf0a180` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `oauth_tokens` DROP FOREIGN KEY `FK_a8c200cc4c90d24e832caf0a180`',
    );
    await queryRunner.query(
      'ALTER TABLE `oauth_tokens` DROP FOREIGN KEY `FK_3d9dfb37837e5dd891bbc81b324`',
    );
    await queryRunner.query(
      'ALTER TABLE `oauth_codes` DROP FOREIGN KEY `FK_4dac391deea4c1f8d24a63107b2`',
    );
    await queryRunner.query(
      'ALTER TABLE `oauth_codes` DROP FOREIGN KEY `FK_1e80210c80509097733e5194bda`',
    );

    await queryRunner.query(
      'DROP INDEX `IDX_62c7da4221e0387c13a5041f6d` ON `oauth_clients`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_eaa26672030dde4bbfe34a963d` ON `oauth_clients`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_b0c094fe1ef0a6c4af8f2b10be` ON `oauth_clients`',
    );
    await queryRunner.query('DROP TABLE `oauth_clients`');
    await queryRunner.query(
      'DROP INDEX `IDX_7ca9fdd6a8b2fb6a457b745ab7` ON `oauth_tokens`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_d41d9ae6c789d78311f4375457` ON `oauth_tokens`',
    );
    await queryRunner.query('DROP TABLE `oauth_tokens`');
    await queryRunner.query(
      'DROP INDEX `IDX_1065caecafb63eab6c74d60814` ON `oauth_codes`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_422fb58499f35099912d8df191` ON `oauth_codes`',
    );
    await queryRunner.query('DROP TABLE `oauth_codes`');
  }
}
