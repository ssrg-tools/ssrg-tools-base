import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixGuids1643551005511 implements MigrationInterface {
  name = 'FixGuids1643551005511';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`song_beatmaps\` CHANGE \`guid\` \`guid\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`world_record_seasons\` CHANGE \`guid\` \`guid\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`song_world_records\` CHANGE \`guid\` \`guid\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`song_clear_cards\` CHANGE \`guid\` \`guid\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`themes\` CHANGE \`guid\` \`guid\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`song_clears_v2\` CHANGE \`guid\` \`guid\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`divisions\` CHANGE \`guid\` \`guid\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`league_ranking\` CHANGE \`guid\` \`guid\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`log_credits\` CHANGE \`guid\` \`guid\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`log_diamonds\` CHANGE \`guid\` \`guid\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`log_diamonds_ads\` CHANGE \`guid\` \`guid\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`log_drops\` CHANGE \`guid\` \`guid\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`oauth_codes\` CHANGE \`guid\` \`guid\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`oauth_tokens\` CHANGE \`guid\` \`guid\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`oauth_clients\` CHANGE \`guid\` \`guid\` varchar(255) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`oauth_clients\` CHANGE \`guid\` \`guid\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`oauth_tokens\` CHANGE \`guid\` \`guid\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`oauth_codes\` CHANGE \`guid\` \`guid\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`log_drops\` CHANGE \`guid\` \`guid\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`log_diamonds_ads\` CHANGE \`guid\` \`guid\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`log_diamonds\` CHANGE \`guid\` \`guid\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`log_credits\` CHANGE \`guid\` \`guid\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`league_ranking\` CHANGE \`guid\` \`guid\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`divisions\` CHANGE \`guid\` \`guid\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`song_clears_v2\` CHANGE \`guid\` \`guid\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`themes\` CHANGE \`guid\` \`guid\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`song_clear_cards\` CHANGE \`guid\` \`guid\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`song_world_records\` CHANGE \`guid\` \`guid\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`world_record_seasons\` CHANGE \`guid\` \`guid\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`song_beatmaps\` CHANGE \`guid\` \`guid\` varchar(255) NULL`);
  }
}
