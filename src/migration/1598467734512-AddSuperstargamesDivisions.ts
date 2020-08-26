import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSuperstargamesDivisions1598467734512 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO superstar_games_divisions_divisions
      SELECT superstar_games.id AS superstarGamesId, divisions.id AS divisionsId -- , divisions.name, superstar_games.name
      FROM divisions
      LEFT JOIN superstar_games ON TRUE
      WHERE divisions.group NOT IN ( 'Platinum', 'Master' )
    `);
    await queryRunner.query(`
      INSERT INTO superstar_games_divisions_divisions
      SELECT superstar_games.id AS superstarGamesId, divisions.id AS divisionsId -- , divisions.name, superstar_games.name
      FROM divisions
      LEFT JOIN superstar_games ON TRUE
      WHERE divisions.group IN ( 'Platinum' ) AND superstar_games.id IN (3, 4, 5, 6)
    `);
    await queryRunner.query(`
      INSERT INTO superstar_games_divisions_divisions
      SELECT superstar_games.id AS superstarGamesId, divisions.id AS divisionsId -- , divisions.name, superstar_games.name
      FROM divisions
      LEFT JOIN superstar_games ON TRUE
      WHERE divisions.group IN ( 'Master' ) AND superstar_games.id IN (4, 5)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // down left empty
  }

}
