import { Index, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Song } from './Song';

@Index(['guid'], { unique: true })
@Index(['songId'], {})
@Entity('songs_by_difficulty', { schema: 'superstar_log' })
export class SongByDifficulty {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'difficulty', length: 255 })
  difficulty: string;

  @Column('smallint', {
    name: 'difficulty_id',
    unsigned: true,
  })
  difficultyId: string;

  @Column('varchar', { name: 'dalcom_beatmap_filename', length: 255 })
  beatmapFilename: string;

  @Column('varchar', { name: 'dalcom_beatmap_fingerprint', length: 255 })
  beatmapFingerprint: string;

  @Column('int', { name: 'count_notes_total', unsigned: true, })
  countNotesTotal: number;

  @Column('int', { name: 'count_notes_nocombo', unsigned: true, })
  countNotesNocombo: number;

  @Column('int', { name: 'count_taps', unsigned: true, })
  countTaps: number;

  @Column('int', { name: 'count_sliders_nocombo', unsigned: true, })
  countSlidersNocombo: number;

  @Column('int', { name: 'count_sliders_total', unsigned: true, })
  countSlidersTotal: number;

  @Column('datetime', {
    name: 'beatmap_date_processed',
    comment: 'date when the beatmap has been processed',
    default: () => 'CURRENT_TIMESTAMP',
  })
  beatmapDateProcessed: Date;

  @Column('int', { name: 'song_id', unsigned: true })
  songId: number;

  @Column('varchar', {
    name: 'guid',
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @ManyToOne(() => Song, (songs) => songs.byDifficulties, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'song_id', referencedColumnName: 'id' }])
  song: Song;
}
