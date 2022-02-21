import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { SqlBool } from '../types';
import { Artist } from './Artist';
import { SongBeatmap } from './SongBeatmap';
import { SongClear } from './SongClear';
import { SongWorldRecord } from './SongWorldRecord';
import { SuperstarGame } from './SuperstarGame';

@Index(['internalSongId', 'gameId'], { unique: true })
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
  @Column('datetime', { nullable: true })
  dateReleasedGame: Date | null;

  @Index('byDateReleasedWorld')
  @Column('datetime', { nullable: true })
  dateReleasedWorld: Date | null;

  @Column('tinyint', {
    name: 'ingame',
    unsigned: true,
    default: 1,
  })
  ingame: SqlBool;

  @Index('bySongCode')
  @Column('varchar', {
    name: 'dalcom_song_id',
    comment: 'game internal song id',
    length: 255,
    nullable: true,
    default: null,
  })
  internalSongId: string | null;

  @Column('varchar', {
    comment: 'defaults to game internal song id',
    length: 255,
    nullable: true,
    default: null,
  })
  imageId: string | null;

  @Column('varchar', {
    length: 255,
    nullable: true,
    default: null,
  })
  imageUrl: string | null;

  @Column('varchar', {
    length: 255,
    nullable: true,
    default: null,
  })
  imageBackgroundUrl: string | null;

  @Column('varchar', {
    length: 255,
    nullable: true,
    default: null,
  })
  audioUrl: string | null;

  @Column('varchar', {
    length: 255,
    nullable: true,
    default: null,
  })
  audioPreviewUrl: string | null;

  @Column('varchar', {
    name: 'dalcom_song_filename',
    comment: 'game internal song filename',
    length: 255,
    nullable: true,
    default: null,
    select: false,
  })
  songFilename: string | null;

  @Column('datetime', {
    name: 'beatmap_date_processed',
    comment: 'date when the beatmaps had been processed',
    nullable: true,
    select: false,
  })
  beatmapDateProcessed: Date;

  @Column('int', { name: 'game_id', unsigned: true })
  gameId: number;

  @Column('int', { name: 'artist_id', unsigned: true })
  artistId: number;

  @Column('varchar', {
    unique: true,
    length: 255,
  })
  guid: string;

  @Column('varchar', {
    name: 'beatmap_fingerprint',
    comment: 'game internal song filename',
    length: 255,
    nullable: true,
    default: null,
    select: false,
  })
  beatmapFingerprint: string;

  @Column('json', { default: '{}', select: false })
  meta: any;

  @Column('int', { unsigned: true, nullable: true })
  swrStatHighscore: number;

  @Column('int', { unsigned: true, nullable: true })
  swrStatMin: number;

  @Column('int', { unsigned: true, nullable: true })
  swrStatMean: number;

  @Column('int', { unsigned: true, nullable: true })
  swrStatMedian: number;

  @ManyToOne(() => Artist, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn([{ name: 'artist_id', referencedColumnName: 'id' }])
  artist: Relation<Artist>;

  @ManyToOne(() => SuperstarGame, superstarGames => superstarGames.songs, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'game_id', referencedColumnName: 'id' }])
  game: Relation<SuperstarGame>;

  @OneToMany(() => SongBeatmap, beatmap => beatmap.song)
  beatmaps: Relation<SongBeatmap>[];

  @OneToMany(() => SongWorldRecord, worldRecord => worldRecord.song)
  worldRecords: Relation<SongWorldRecord>[];

  @OneToMany(() => SongClear, songClear => songClear.song)
  songClears: Relation<SongClear>[];
}
