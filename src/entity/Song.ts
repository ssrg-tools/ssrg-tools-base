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
import { SongByDifficulty } from './SongByDifficulty';

@Index(['guid'], { unique: true })
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

  @Column('decimal', {
    name: 'length_nominal',
    nullable: true,
    comment: 'length in (fractions of) minutes',
    precision: 10,
    scale: 3,
  })
  lengthNominal: string | null;

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
    name: 'dalcom_song_id',
    comment: 'game internal song id',
    unique: true,
    length: 255,
    default: '\'\'',
  })
  internalSongId: string;

  @Column('varchar', {
    name: 'dalcom_song_filename',
    comment: 'game internal song filename',
    unique: true,
    length: 255,
    default: '\'\'',
  })
  songFilename: string;

  @Column('varchar', {
    name: 'beatmap_fingerprint',
    comment: 'game internal song filename',
    unique: true,
    length: 255,
    default: '\'\'',
  })
  beatmapFingerprint: string;

  @Column('datetime', {
    name: 'beatmap_date_processed',
    comment: 'date when the beatmaps had been processed',
    nullable: true,
  })
  beatmapDateProcessed: Date;

  @ManyToOne(() => SuperstarGame, (superstarGames) => superstarGames.songs, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'game_id', referencedColumnName: 'id' }])
  game: SuperstarGame;

  @OneToMany(() => SongByDifficulty, (songByDifficulty) => songByDifficulty.song)
  byDifficulties: SongByDifficulty[];

  @OneToMany(() => SongClear, (songClearsV2) => songClearsV2.song)
  songClearsVs: SongClear[];
}
