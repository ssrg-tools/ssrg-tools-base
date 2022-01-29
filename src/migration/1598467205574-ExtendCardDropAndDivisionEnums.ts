import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendCardDropAndDivisionEnums1598467205574 implements MigrationInterface {
  name = 'ExtendCardDropAndDivisionEnums1598467205574';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `divisions` CHANGE `group` `group` enum ('Bronze', 'Silver', 'Gold', 'Platinum', 'Master') NOT NULL",
    );

    await queryRunner.query(
      "ALTER TABLE `log_drops` CHANGE `source` `source` enum ('Purchase (Diamonds)', 'Purchase (RP)', 'Purchase ($$$)', 'Reward', 'Reward - Event', 'Reward - Gift', 'Box Event - Normal', 'Box Event - Premium', 'Star Pass - Normal', 'Star Pass - Premium', 'Challenge', 'Clear') NOT NULL",
    );

    await queryRunner.query(`
      INSERT INTO \`divisions\` VALUES (NULL, 'Master', 'Master I', 1.2, 13, 1, NULL);
    `);
    await queryRunner.query(`
      INSERT INTO \`divisions\` VALUES (NULL, 'Master', 'Master II', 1.3, 14, 2, NULL);
    `);
    await queryRunner.query(`
      INSERT INTO \`divisions\` VALUES (NULL, 'Master', 'Master III', 1.4, 15, 3, NULL);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // no down on purpose
  }
}
