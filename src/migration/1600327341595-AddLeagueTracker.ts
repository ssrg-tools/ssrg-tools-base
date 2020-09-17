import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLeagueTracker1600327341595 implements MigrationInterface {
  name = 'AddLeagueTracker1600327341595';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`league_tracker\` (
      \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
      \`nickname\` varchar(255) NOT NULL,
      \`score\` int UNSIGNED NOT NULL,
      \`date\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`divisionId\` int UNSIGNED NULL,
      \`divisionGroup\` tinyint UNSIGNED NOT NULL COMMENT \'in SSRGs the divisions are divided into two groups\',
      \`comment\` varchar(255) NULL,
      \`divisionKey\` varchar(255) NULL COMMENT \'if available, connects people that have been in the same division, e.g. Week 43 Gold III-3\', \`meta\` longtext NULL,
      \`objectID\` int UNSIGNED NULL,
      \`specialUserCode\` int UNSIGNED NULL,
      \`gameId\` int UNSIGNED NOT NULL,
      \`guid\` varchar(255) NOT NULL,
      INDEX \`byDate\` (\`date\`),
      UNIQUE INDEX \`IDX_a5b797770833ca08ffadcb9967\` (\`guid\`),
      PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`);

    await queryRunner.query('ALTER TABLE `league_tracker` ADD CONSTRAINT `FK_e0b3f9fcf35ff316a213c23d986` FOREIGN KEY (`divisionId`) REFERENCES `divisions`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT');
    await queryRunner.query('ALTER TABLE `league_tracker` ADD CONSTRAINT `FK_900818981d9eb49fd11fd70287c` FOREIGN KEY (`gameId`) REFERENCES `superstar_games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `league_tracker` DROP FOREIGN KEY `FK_900818981d9eb49fd11fd70287c`');
    await queryRunner.query('ALTER TABLE `league_tracker` DROP FOREIGN KEY `FK_e0b3f9fcf35ff316a213c23d986`');

    await queryRunner.query('DROP INDEX `IDX_a5b797770833ca08ffadcb9967` ON `league_tracker`');
    await queryRunner.query('DROP INDEX `byDate` ON `league_tracker`');
    await queryRunner.query('DROP TABLE `league_tracker`');
  }

}
