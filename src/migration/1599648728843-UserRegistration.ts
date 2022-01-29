import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRegistration1599648728843 implements MigrationInterface {
  name = 'UserRegistration1599648728843';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `users_logins` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, `successful` tinyint(1) NOT NULL, `userId` int UNSIGNED NULL, INDEX `byDate` (`date`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `users_verifications` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `codeHash` varchar(100) NOT NULL, `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, `completed` datetime NULL, `userId` int UNSIGNED NULL, INDEX `byCreated` (`created`), INDEX `byCompleted` (`completed`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );

    await queryRunner.query(
      'ALTER TABLE `users_logins` ADD CONSTRAINT `FK_9afce9c631e9dd84f6f4c9b0bc9` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `users_verifications` ADD CONSTRAINT `FK_41e98794ccf9f055ddab737c9d5` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users_verifications` DROP FOREIGN KEY `FK_41e98794ccf9f055ddab737c9d5`');
    await queryRunner.query('ALTER TABLE `users_logins` DROP FOREIGN KEY `FK_9afce9c631e9dd84f6f4c9b0bc9`');

    await queryRunner.query('DROP INDEX `byCompleted` ON `users_verifications`');
    await queryRunner.query('DROP INDEX `byCreated` ON `users_verifications`');
    await queryRunner.query('DROP TABLE `users_verifications`');
    await queryRunner.query('DROP INDEX `byDate` ON `users_logins`');
    await queryRunner.query('DROP TABLE `users_logins`');
  }
}
