import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUrls1643579771151 implements MigrationInterface {
  name = 'AddUrls1643579771151';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`song_beatmap_contents\` (\`id\` int UNSIGNED NOT NULL, \`parserVersion\` int UNSIGNED NOT NULL, \`data\` longtext NOT NULL, \`beatmapDateProcessed\` datetime NOT NULL COMMENT 'date when the beatmap has been processed' DEFAULT CURRENT_TIMESTAMP(), \`beatmapFingerprint\` varchar(255) NOT NULL, \`meta\` longtext NOT NULL DEFAULT '{}', \`guid\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_e26f0b774534841d87afca45c6\` (\`guid\`), UNIQUE INDEX \`IDX_50496f0dbaa4d14602ad676f33\` (\`id\`, \`parserVersion\`), UNIQUE INDEX \`REL_eadbb8f20cb6eedaa83ae9088b\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`artists\` ADD \`imageUrl\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`song_beatmaps\` ADD \`seqUrl\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`song_beatmaps\` ADD \`mapUrl\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`songs\` ADD \`imageUrl\` varchar(255) NULL AFTER \`imageId\``);
    await queryRunner.query(`ALTER TABLE \`songs\` ADD \`imageBackgroundUrl\` varchar(255) NULL AFTER \`imageUrl\``);
    await queryRunner.query(`ALTER TABLE \`songs\` ADD \`audioUrl\` varchar(255) NULL AFTER \`imageBackgroundUrl\``);
    await queryRunner.query(`ALTER TABLE \`songs\` ADD \`audioPreviewUrl\` varchar(255) NULL AFTER \`audioUrl\``);
    await queryRunner.query(
      `ALTER TABLE \`song_beatmap_contents\` ADD CONSTRAINT \`FK_eadbb8f20cb6eedaa83ae9088b9\` FOREIGN KEY (\`id\`) REFERENCES \`song_beatmaps\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`song_beatmap_contents\` DROP FOREIGN KEY \`FK_eadbb8f20cb6eedaa83ae9088b9\``,
    );
    await queryRunner.query(`ALTER TABLE \`songs\` DROP COLUMN \`audioUrl\``);
    await queryRunner.query(`ALTER TABLE \`songs\` DROP COLUMN \`audioPreviewUrl\``);
    await queryRunner.query(`ALTER TABLE \`songs\` DROP COLUMN \`imageUrl\``);
    await queryRunner.query(`ALTER TABLE \`songs\` DROP COLUMN \`imageBackgroundUrl\``);
    await queryRunner.query(`ALTER TABLE \`song_beatmaps\` DROP COLUMN \`mapUrl\``);
    await queryRunner.query(`ALTER TABLE \`song_beatmaps\` DROP COLUMN \`seqUrl\``);
    await queryRunner.query(`ALTER TABLE \`artists\` DROP COLUMN \`imageUrl\``);
    await queryRunner.query(`DROP INDEX \`REL_eadbb8f20cb6eedaa83ae9088b\` ON \`song_beatmap_contents\``);
    await queryRunner.query(`DROP INDEX \`IDX_e26f0b774534841d87afca45c6\` ON \`song_beatmap_contents\``);
    await queryRunner.query(`DROP TABLE \`song_beatmap_contents\``);
  }
}
