import { generate_guid } from '../guid';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArtistsImportGFriend1600365065460 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO artists VALUES (NULL, 'GFRIEND', 6, '${generate_guid()}', 1);`,
    );
    await queryRunner.query(`INSERT INTO artists_members VALUES
      (NULL, (SELECT id FROM artists WHERE artists.gameId = 1), 'Sowon', 0, '${generate_guid()}'),
      (NULL, (SELECT id FROM artists WHERE artists.gameId = 1), 'Yerin', 1, '${generate_guid()}'),
      (NULL, (SELECT id FROM artists WHERE artists.gameId = 1), 'Eunha', 2, '${generate_guid()}'),
      (NULL, (SELECT id FROM artists WHERE artists.gameId = 1), 'Yuju', 3, '${generate_guid()}'),
      (NULL, (SELECT id FROM artists WHERE artists.gameId = 1), 'SinB', 4, '${generate_guid()}'),
      (NULL, (SELECT id FROM artists WHERE artists.gameId = 1), 'Umji', 5, '${generate_guid()}');`);
    await queryRunner.query(`UPDATE themes SET themes.artist_id =
      (SELECT id FROM artists WHERE artists.gameId = 1) WHERE themes.game_id = 1;`);
    await queryRunner.query(`UPDATE songs SET songs.artist_id =
      (SELECT id FROM artists WHERE artists.gameId = 1) WHERE songs.game_id = 1;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // not supported
    console.error('not supported.');
  }
}
