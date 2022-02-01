import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSeasonTaskResult1643709285930 implements MigrationInterface {
  name = 'AddSeasonTaskResult1643709285930';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tasks_results\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`finished\` datetime NULL, \`status\` varchar(255) NOT NULL DEFAULT 'incomplete', \`guid\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`log\` longtext NULL, \`gameGuid\` varchar(255) NULL, INDEX \`byDateCreated\` (\`created\`), INDEX \`byDateUpdated\` (\`updated\`), INDEX \`byDateFinished\` (\`finished\`), INDEX \`byType\` (\`type\`, \`status\`), INDEX \`IDX_ae6afdc842982be3e5fec682ec\` (\`gameGuid\`), UNIQUE INDEX \`byGuid\` (\`guid\`), INDEX \`IDX_a6878d5ba15f7d2d68692bd7b1\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    // This foreign key is not referenced from the entity definition
    await queryRunner.query(
      `ALTER TABLE \`tasks_results\` ADD CONSTRAINT \`FK_ae6afdc842982be3e5fec682ec8\` FOREIGN KEY (\`gameGuid\`) REFERENCES \`superstar_log\`.\`superstar_games\`(\`guid\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks_results\` DROP FOREIGN KEY \`FK_ae6afdc842982be3e5fec682ec8\``);
    await queryRunner.query(`DROP INDEX \`IDX_a6878d5ba15f7d2d68692bd7b1\` ON \`tasks_results\``);
    await queryRunner.query(`DROP INDEX \`byGuid\` ON \`tasks_results\``);
    await queryRunner.query(`DROP INDEX \`IDX_ae6afdc842982be3e5fec682ec\` ON \`tasks_results\``);
    await queryRunner.query(`DROP INDEX \`byType\` ON \`tasks_results\``);
    await queryRunner.query(`DROP INDEX \`byDateFinished\` ON \`tasks_results\``);
    await queryRunner.query(`DROP INDEX \`byDateUpdated\` ON \`tasks_results\``);
    await queryRunner.query(`DROP INDEX \`byDateCreated\` ON \`tasks_results\``);
    await queryRunner.query(`DROP TABLE \`tasks_results\``);
  }
}
