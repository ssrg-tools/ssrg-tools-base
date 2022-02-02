import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendTasksResults1643763155499 implements MigrationInterface {
  name = 'ExtendTasksResults1643763155499';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tasks_results\` ADD \`userGuid\` varchar(255) NULL COMMENT 'user who triggered this task'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tasks_results\` ADD \`result\` longtext NOT NULL COMMENT 'task specific (output) data' DEFAULT '{}'`,
    );
    await queryRunner.query(`ALTER TABLE \`tasks_results\` ADD \`meta\` longtext NOT NULL DEFAULT '{}'`);
    await queryRunner.query(
      `ALTER TABLE \`tasks_results\` ADD CONSTRAINT \`REL_tasks_results_userGuid\` FOREIGN KEY (\`userGuid\`) REFERENCES \`superstar_log\`.\`users\`(\`guid\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks_results\` DROP FOREIGN KEY \`REL_tasks_results_userGuid\``);
    await queryRunner.query(`ALTER TABLE \`tasks_results\` DROP COLUMN \`meta\``);
    await queryRunner.query(`ALTER TABLE \`tasks_results\` DROP COLUMN \`result\``);
    await queryRunner.query(`ALTER TABLE \`tasks_results\` DROP COLUMN \`userGuid\``);
  }
}
