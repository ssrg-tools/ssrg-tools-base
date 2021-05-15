import { Index, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Index('bySongAndSeason', ['gameGuid', 'songCode', 'seasonCode'])
@Entity('song_world_records_archive')
export class SongWorldRecordArchive {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: bigint;

  @Column('varchar', {
    length: 50,
  })
  gameGuid: string;

  @Column('varchar', {
    length: 50,
  })
  gameKey: string;

  // not referencing with songs table on purpose
  @Column('int', { unsigned: true })
  songCode: number;

  @Column('int', { unsigned: true })
  seasonCode: number;

  @Column('json')
  data: any;

  @Index('byDateEntry')
  @Column('datetime', {
    comment: 'the date this entry was entered into the database',
  })
  dateEntry: Date;

  @Index('byDateObserved')
  @Column('datetime', { comment: 'the date this file was downloaded' })
  dateObserved: Date;

  @Column('varchar', {
    length: 255,
    default: 'manual',
  })
  source: string;

  @Column('varchar', {
    unique: true,
    length: 50,
  })
  guid: string;

  @Column('varchar', { length: 255 })
  fingerprint: string;
}
