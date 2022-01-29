import { generate_guid } from '../guid';
import { MigrationInterface, QueryRunner } from 'typeorm';
import _ from 'lodash';

export class ArtistsImportArtists1600365081098 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const connection = queryRunner.connection;
    const themesRaw: {
      album;
      cardCount;
      gameId;
    }[] = await queryRunner.query(`SELECT themes.album, themes.cardCount, themes.game_id as gameId
    FROM themes WHERE not themes.game_id = 1 GROUP BY themes.album;`);
    const themes = themesRaw.map(rawTheme => _.extend(rawTheme, { guid: generate_guid() }));
    console.log(`About to insert ${themes.length} artists with ${_.sumBy(themes, 'cardCount')} members.`);

    for await (const theme of themes) {
      const artistResult = await connection
        .createQueryBuilder(queryRunner)
        .insert()
        .into('artists')
        .values({
          name: theme.album,
          cardCount: theme.cardCount,
          gameId: theme.gameId,
          guid: theme.guid,
        })
        .execute();
      if (!artistResult.identifiers.length) {
        console.error(`Error inserting artist from theme '${theme.album}'.`);
        process.exit(1);
      }
      const artistId = artistResult.identifiers[0].id;
      const membersResult = await connection
        .createQueryBuilder(queryRunner)
        .insert()
        .into('artists_members')
        .values(
          _.range(0, theme.cardCount).map(memberOffset => ({
            name: `${theme.album} member #${memberOffset + 1}`,
            memberOffset,
            guid: generate_guid(),
            artistId,
          })),
        )
        .execute();
      console.log(`Added ${theme.album} with ${membersResult.identifiers.length} members.`);
    }
    await queryRunner.query(`UPDATE songs
      INNER JOIN artists ON songs.album = artists.name
      SET songs.artist_id = artists.id
      WHERE not game_id = 1`);
    await queryRunner.query(`UPDATE themes
      INNER JOIN artists ON themes.album = artists.name
      SET themes.artist_id = artists.id
      WHERE not game_id = 1`);
    console.log(`Done.`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // not supported
    console.error('not supported.');
  }
}
