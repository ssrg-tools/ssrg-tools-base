import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SuperstarGame } from './SuperstarGame';
import { SongClear } from './SongClear';
import { SongBeatmap } from './SongBeatmap';
import { SongWorldRecord } from './SongWorldRecord';
import { SqlBool } from '../types';
import { DateParts } from './DateParts.embed';

@Index(['guid'], { unique: true })
@Index(['internalSongId', 'gameId'], { unique: true })
@Index(['gameId'], {})
@Entity('songs', { schema: 'superstar_log' })
export class Song {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('varchar', { name: 'album', length: 255 })
  album: string;

  @Column('varchar', {
    name: 'length_display',
    nullable: true,
    comment: 'length for display, e.g. 1:34',
    length: 255,
  })
  lengthDisplay: string | null;

  /** deprecated */
  @Column('decimal', {
    name: 'length_nominal',
    nullable: true,
    comment: 'length in (fractions of) minutes',
    precision: 10,
    scale: 6,
    select: false,
  })
  lengthNominal: string | null;

  @Column('decimal', {
    name: 'length_seconds',
    nullable: true,
    comment: 'length in seconds',
    precision: 10,
    scale: 3,
  })
  lengthSeconds: string | null;

  @Index('byDateReleasedGame')
  @Column('datetime')
  dateReleasedGame: Date;

  @Index('byDateReleasedWorld')
  @Column('datetime')
  dateReleasedWorld: Date;

  @Column('tinyint', {
    name: 'ingame',
    unsigned: true,
    default: 1,
  })
  ingame: SqlBool;

  @Column('varchar', {
    name: 'dalcom_song_id',
    comment: 'game internal song id',
    length: 255,
    nullable: true,
    default: null,
  })
  internalSongId: string;

  @Column('varchar', {
    name: 'dalcom_song_filename',
    comment: 'game internal song filename',
    unique: true,
    length: 255,
    nullable: true,
    default: null,
    select: false,
  })
  songFilename: string;

  @Column('datetime', {
    name: 'beatmap_date_processed',
    comment: 'date when the beatmaps had been processed',
    nullable: true,
    select: false,
  })
  beatmapDateProcessed: Date;

  @Column('int', { name: 'game_id', unsigned: true, default: 1 })
  gameId: number;

  @Column('varchar', {
    name: 'guid',
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @Column('varchar', {
    name: 'beatmap_fingerprint',
    comment: 'game internal song filename',
    unique: true,
    length: 255,
    nullable: true,
    default: null,
    select: false,
  })
  beatmapFingerprint: string;

  @ManyToOne(() => SuperstarGame, (superstarGames) => superstarGames.songs, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'game_id', referencedColumnName: 'id' }])
  game: SuperstarGame;

  @OneToMany(() => SongBeatmap, (beatmap) => beatmap.song)
  beatmaps: SongBeatmap[];

  @OneToMany(() => SongWorldRecord, (worldRecord) => worldRecord.song)
  worldRecords: SongWorldRecord[];

  @OneToMany(() => SongClear, (songClear) => songClear.song)
  songClears: SongClear[];
}
