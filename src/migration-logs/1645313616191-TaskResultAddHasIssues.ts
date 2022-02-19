import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskResultAddHasIssues1645313616191 implements MigrationInterface {
  name = 'TaskResultAddHasIssues1645313616191';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tasks_results\` ADD \`hasIssues\` tinyint NOT NULL COMMENT 'whether this task did finish but had issues, e.g. skipped errors' DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks_results\` DROP COLUMN \`hasIssues\``);
  }
}
