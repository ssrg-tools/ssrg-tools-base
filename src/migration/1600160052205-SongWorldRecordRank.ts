import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SongWorldRecordRank1600160052205 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('song_world_records', new TableColumn({
      name: 'rank',
      type: 'int',
      unsigned: true,
      default: 1,
    }));
    await queryRunner.changeColumn('song_world_records', 'rank', new TableColumn({
      name: 'rank',
      type: 'int',
      unsigned: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // not supported
    console.error('SongWorldRecordRank downgrade not supported');
  }

}
