import { ArchiveSongWorldRecord1619070035648 } from '../migration/1619070035648-ArchiveSongWorldRecord';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveSWRArchive1620952339677 implements MigrationInterface {
  private readonly ArchiveSongWorldRecord1619070035648 = new ArchiveSongWorldRecord1619070035648();

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.ArchiveSongWorldRecord1619070035648.down(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.ArchiveSongWorldRecord1619070035648.up(queryRunner);
  }
}
