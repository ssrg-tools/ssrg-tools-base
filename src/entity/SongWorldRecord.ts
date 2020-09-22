import { PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, Entity } from 'typeorm';
import { Song } from './Song';
import { CardDisplay } from './CardDisplay.embed';
import { WorldRecordSeason } from './WorldRecordSeason';

@Entity('song_world_records', { schema: 'superstar_log' })
export class SongWorldRecord {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Index()
  @Column('int', { name: 'song_id', unsigned: true })
  songId: number;

  @Column('int', { name: 'object_id', unsigned: true })
  objectID: number;

  @Column('int', { name: 'special_user_code', unsigned: true })
  specialUserCode: number;

  @Column('varchar', { length: 255 })
  nickname: string;

  @Column('int', { name: 'profile_image', unsigned: true, nullable: true })
  profileImage: number;

  @Column(type => CardDisplay)
  leaderCard?: CardDisplay;

  @Column('int', { unsigned: true })
  highscore: number;

  @Index('byDateRecorded')
  @Column('datetime', { name: 'date_recorded' })
  dateRecorded: Date;

  @Column('int', { unsigned: true })
  rank: number;

  @ManyToOne(() => WorldRecordSeason, (season) => season.entries, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'season_id', referencedColumnName: 'id' }])
  season: WorldRecordSeason;

  @Column('longtext', { name: 'meta', default: '{}' })
  meta: string;

  @Column('varchar', {
    name: 'guid',
    nullable: true,
    unique: true,
    length: 255,
  })
  guid?: string;

  @ManyToOne(() => Song, (songs) => songs.worldRecords, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'song_id', referencedColumnName: 'id' }])
  song: Song;

}
