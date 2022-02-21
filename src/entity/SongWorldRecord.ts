import { PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, Entity, Relation } from 'typeorm';
import { Song } from './Song';
import { CardDisplay } from './CardDisplay.embed';
import { WorldRecordSeason } from './WorldRecordSeason';
import { User } from './User';
import { PlayerProfile } from './PlayerProfile';

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

  @Column('int', { unsigned: true, nullable: true })
  profileId: number;

  @Column('int', { name: 'profile_image', unsigned: true, nullable: true })
  profileImage: number;

  @Column(() => CardDisplay)
  leaderCard?: CardDisplay;

  @Column('int', { unsigned: true })
  highscore: number;

  @Index('byDateRecorded')
  @Column('datetime', { name: 'date_recorded' })
  dateRecorded: Date;

  @Index('byDateObserved')
  @Column('datetime')
  dateObserved: Date;

  @Index('byDateEntry')
  @Column('datetime')
  dateEntry: Date;

  @Index('byRank')
  @Column('int', { unsigned: true })
  rank: number;

  @Column('int', { name: 'season_id', unsigned: true })
  seasonId: number;

  @ManyToOne(() => WorldRecordSeason, season => season.entries, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'season_id', referencedColumnName: 'id' }])
  season: Relation<WorldRecordSeason>;

  @ManyToOne(() => User, users => users.observedSongWorldRecords, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'observerUserId', referencedColumnName: 'id' }])
  observer: Relation<User>;

  @Column('longtext', { name: 'meta', default: '{}' })
  meta: string;

  @Column('varchar', {
    unique: true,
    length: 255,
  })
  guid: string;

  @ManyToOne(() => PlayerProfile, player => player.nicknameHistory, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'profileId', referencedColumnName: 'id' }])
  profile: Relation<PlayerProfile>;

  @ManyToOne(() => Song, songs => songs.worldRecords, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'song_id', referencedColumnName: 'id' }])
  song: Relation<Song>;
}
