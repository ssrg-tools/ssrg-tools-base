import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskResultAddMarkIgnored1645274908622 implements MigrationInterface {
  name = 'TaskResultAddMarkIgnored1645274908622';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tasks_results\` ADD \`markIgnored\` tinyint NOT NULL COMMENT 'whether this task result is inconsequential (e.g. a task that was skipped, or produced no output)' DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks_results\` DROP COLUMN \`markIgnored\``);
  }
}
