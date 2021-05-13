import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGamedataFiles1620946436410 implements MigrationInterface {
  name = 'AddGamedataFiles1620946436410'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`ssrg_tools_gamedata\`.\`song_world_records_archive\` (
      \`id\` BIGINT(20) unsigned NOT NULL AUTO_INCREMENT,
      \`gameGuid\` varchar(50) NOT NULL,
      \`gameKey\` varchar(50) NOT NULL,
      \`songCode\` int(11) unsigned NOT NULL,
      \`seasonCode\` int(11) unsigned NOT NULL,
      \`data\` longtext NOT NULL,
      \`dateEntry\` datetime NOT NULL COMMENT 'the date this entry was entered into the database',
      \`dateObserved\` datetime NOT NULL COMMENT 'the date this file was downloaded',
      \`source\` varchar(255) NOT NULL DEFAULT 'manual',
      \`guid\` varchar(50) NOT NULL,
      \`fingerprint\` varchar(255) NOT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE INDEX \`IDX_63ea2135f900847fcb0c1b3e25\` (\`guid\`),
      INDEX \`byDateEntry\` (\`dateEntry\`),
      INDEX \`byDateObserved\` (\`dateObserved\`),
      INDEX \`bySongAndSeason\` (\`gameGuid\`,\`songCode\`,\`seasonCode\`)
    ) ENGINE=ROCKSDB`);

    await queryRunner.query(`CREATE TABLE \`ssrg_tools_gamedata\`.\`assets_files\` (
      \`id\` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`gameGuid\` varchar(50) NOT NULL,
      \`version\` INT(11) UNSIGNED NOT NULL,
      \`key\` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',
      \`data\` LONGTEXT NOT NULL COLLATE 'utf8mb4_unicode_ci',
      \`date\` DATETIME NOT NULL,
      \`guid\` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',
      \`fingerprint\` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
      PRIMARY KEY (\`id\`),
      UNIQUE INDEX \`IDX_6567641ee6f53ea262cdbfe7ef\` (\`guid\`),
      UNIQUE INDEX \`perGameAndVersionAndKey\` (\`gameGuid\`, \`version\`, \`key\`),
      INDEX \`byDate\` (\`date\`)
    ) ENGINE=ROCKSDB`);

    await queryRunner.query(`CREATE TABLE \`ssrg_tools_gamedata\`.\`assets_manifests\` (
      \`id\` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`gameGuid\` varchar(50) NOT NULL,
      \`versionString\` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',
      \`versionNumber\` INT(11) UNSIGNED NOT NULL,
      \`data\` LONGTEXT NOT NULL COLLATE 'utf8mb4_unicode_ci',
      \`date\` DATETIME NOT NULL,
      \`guid\` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',
      PRIMARY KEY (\`id\`) USING BTREE,
      UNIQUE INDEX \`IDX_a4db39d07694a4973c163769dc\` (\`guid\`),
      UNIQUE INDEX \`perGameAndVersion\` (\`gameGuid\`, \`versionString\`),
      INDEX \`byDate\` (\`date\`)
    ) ENGINE=ROCKSDB`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `perGameAndVersion` ON `assets_manifests`');
    await queryRunner.query('DROP INDEX `byDate` ON `assets_manifests`');
    await queryRunner.query('ALTER TABLE `assets_manifests` DROP INDEX `IDX_a4db39d07694a4973c163769dc`');
    await queryRunner.query('ALTER TABLE `assets_files` DROP INDEX `IDX_6567641ee6f53ea262cdbfe7ef`');
    await queryRunner.query('ALTER TABLE `assets_files` DROP INDEX `perGameAndVersionAndKey`');
    await queryRunner.query('ALTER TABLE `assets_files` DROP INDEX `byDate`');

    await queryRunner.query('ALTER TABLE `song_world_records_archive` DROP INDEX `IDX_63ea2135f900847fcb0c1b3e25`');
    await queryRunner.query('ALTER TABLE `song_world_records_archive` DROP INDEX `byDateEntry`');
    await queryRunner.query('ALTER TABLE `song_world_records_archive` DROP INDEX `byDateObserved`');
    await queryRunner.query('ALTER TABLE `song_world_records_archive` DROP INDEX `bySongAndSeason`');

    await queryRunner.query('DROP TABLE `assets_files`');
    await queryRunner.query('DROP TABLE `assets_manifests`');
    await queryRunner.query('DROP TABLE `song_world_records_archive`');
  }
}
