import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFiles1619470517775 implements MigrationInterface {
  name = 'AddFiles1619470517775';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `files` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `key` varchar(255) NOT NULL, `fingerprint` varchar(255) NOT NULL, `size` int UNSIGNED NOT NULL, `mime` varchar(255) NULL, `meta` longtext NOT NULL DEFAULT '{}', `restriction` varchar(255) NOT NULL DEFAULT 'public', `engine` varchar(255) NOT NULL, `engineBucket` varchar(255) NOT NULL, `dateUploaded` datetime NOT NULL, `guid` varchar(255) NOT NULL, `userId` int UNSIGNED NULL, `header` varchar(255) NULL, `type` varchar(255) NOT NULL, INDEX `byFingerprint` (`fingerprint`), INDEX `byEngine` (`engine`), INDEX `byEngineBucket` (`engineBucket`), INDEX `byDateUploaded` (`dateUploaded`), UNIQUE INDEX `byGuid` (`guid`), UNIQUE INDEX `byKey` (`key`), INDEX `IDX_bbb0f2912c320f6b76e04091e3` (`type`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'ALTER TABLE `files` ADD CONSTRAINT `FK_7e7425b17f9e707331e9a6c7335` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `files` DROP FOREIGN KEY `FK_7e7425b17f9e707331e9a6c7335`');
    await queryRunner.query('DROP INDEX `IDX_bbb0f2912c320f6b76e04091e3` ON `files`');
    await queryRunner.query('DROP INDEX `byKey` ON `files`');
    await queryRunner.query('DROP INDEX `byGuid` ON `files`');
    await queryRunner.query('DROP INDEX `byDateUploaded` ON `files`');
    await queryRunner.query('DROP INDEX `byEngineBucket` ON `files`');
    await queryRunner.query('DROP INDEX `byEngine` ON `files`');
    await queryRunner.query('DROP INDEX `byFingerprint` ON `files`');
    await queryRunner.query('DROP TABLE `files`');
  }
}
