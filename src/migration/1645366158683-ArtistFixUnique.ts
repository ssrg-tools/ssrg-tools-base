import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArtistFixUnique1645366158683 implements MigrationInterface {
  name = 'ArtistFixUnique1645366158683';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_70c3685e197743b963339d158c\` ON \`artists\``);
    await queryRunner.query(`CREATE UNIQUE INDEX \`artistName\` ON \`artists\` (\`name\`, \`gameId\`)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`artistName\` ON \`artists\``);
    await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_70c3685e197743b963339d158c\` ON \`artists\` (\`name\`)`);
  }
}
