import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArtistMemberAddInternalIds1645215702780 implements MigrationInterface {
  name = 'ArtistMemberAddInternalIds1645215702780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`artists_members\` ADD \`internalIds\` text NULL COMMENT 'game internal artist ids' DEFAULT '[]'`,
    );
    await queryRunner.query(`CREATE INDEX \`byCode\` ON \`artists_members\` (\`internalIds\`)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`byCode\` ON \`artists_members\``);
    await queryRunner.query(`ALTER TABLE \`artists_members\` DROP COLUMN \`internalIds\``);
  }
}
