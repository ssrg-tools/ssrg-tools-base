import { Index, Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { SuperstarGame } from '../SuperstarGame';

@Index('bySongAndSeason', [ 'gameId', 'songCode', 'seasonCode' ])
@Entity('zz__archive_song_world_records', { schema: 'superstar_log' })
export class SongWorldRecordArchive {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('int', { unsigned: true })
  gameId: number;

  // not referencing with songs table on purpose
  @Column('int', { unsigned: true })
  songCode: number;

  @Column('int', { unsigned: true })
  seasonCode: number;

  @Column('json')
  data: object;

  @Index('byDateEntry')
  @Column('datetime', { comment: 'the date this entry was entered into the database' })
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
    length: 255,
  })
  guid: string;

  @Column('varchar', { length: 255 })
  fingerprint: string;

  @ManyToOne(
    () => SuperstarGame,
    (superstarGames) => superstarGames.archiveSongWorldRecords,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ name: 'gameId', referencedColumnName: 'id' }])
  game: SuperstarGame;
}
