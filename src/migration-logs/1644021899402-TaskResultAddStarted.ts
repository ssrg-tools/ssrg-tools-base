import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskResultAddStarted1644021899402 implements MigrationInterface {
  name = 'TaskResultAddStarted1644021899402';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tasks_results\` ADD \`started\` datetime(6) NOT NULL COMMENT 'time of task start (defaults to creation)' DEFAULT CURRENT_TIMESTAMP(6) AFTER \`updated\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tasks_results\` CHANGE \`created\` \`created\` datetime(6) NOT NULL COMMENT 'time of record in database' DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(`CREATE INDEX \`byDateStarted\` ON \`tasks_results\` (\`started\`)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`byDateStarted\` ON \`tasks_results\``);
    await queryRunner.query(
      `ALTER TABLE \`tasks_results\` CHANGE \`created\` \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(`ALTER TABLE \`tasks_results\` DROP COLUMN \`started\``);
  }
}
