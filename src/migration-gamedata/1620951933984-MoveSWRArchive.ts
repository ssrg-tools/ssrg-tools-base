import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoveSWRArchive1620951933984 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO \`ssrg_tools_gamedata\`.\`song_world_records_archive\`
    (\`id\`, gameKey, gameGuid, songCode, seasonCode, dateEntry, dateObserved, \`data\`, \`source\`, \`guid\`, \`fingerprint\`)
    SELECT
       \`aswr\`.\`id\`,
       \`g\`.\`key\` AS gameKey,
       \`g\`.\`guid\` AS gameGuid,
       \`aswr\`.\`songCode\`,
       \`aswr\`.\`seasonCode\`,
       \`aswr\`.\`dateEntry\`,
       \`aswr\`.\`dateObserved\`,
       \`aswr\`.\`data\`,
       \`aswr\`.\`source\`,
       \`aswr\`.\`guid\`,
       \`aswr\`.\`fingerprint\`
    FROM \`superstar_log\`.\`zz__archive_song_world_records\` \`aswr\`
    INNER JOIN \`superstar_log\`.\`superstar_games\` \`g\` ON \`g\`.\`id\` = \`aswr\`.\`gameId\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Empty
  }
}
