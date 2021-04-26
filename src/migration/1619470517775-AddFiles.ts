import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFiles1619470517775 implements MigrationInterface {
  name = 'AddFiles1619470517775';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE `files` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `key` varchar(255) NOT NULL, `fingerprint` varchar(255) NOT NULL, `size` int UNSIGNED NOT NULL, `mime` varchar(255) NULL, `meta` longtext NOT NULL, `restriction` varchar(255) NOT NULL DEFAULT \'public\', `engine` varchar(255) NOT NULL, `engineBucket` varchar(255) NOT NULL, `dateUploaded` datetime NOT NULL, `guid` varchar(255) NOT NULL, `header` varbinary(255) NULL, `type` varchar(255) NOT NULL, INDEX `byFingerprint` (`fingerprint`), INDEX `byEngine` (`engine`), INDEX `byEngineBucket` (`engineBucket`), INDEX `byDateUploaded` (`dateUploaded`), UNIQUE INDEX `byGuid` (`guid`), UNIQUE INDEX `byKey` (`key`), INDEX `IDX_bbb0f2912c320f6b76e04091e3` (`type`), PRIMARY KEY (`id`)) ENGINE=InnoDB');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
