import { MigrationInterface, QueryRunner } from 'typeorm';

export class LeagueRankingRemoveScoreCalc1643540965443 implements MigrationInterface {
  name = 'LeagueRankingRemoveScoreCalc1643540965443';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`league_ranking\` DROP COLUMN \`score_above\`, DROP COLUMN \`score_below\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`league_ranking\` ADD \`score_below\` int AS (\`score\` - \`diff_below\`) STORED,  ADD \`score_above\` int AS (\`score\` + \`diff_above\`) STORED`,
    );
  }
}
