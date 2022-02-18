import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Song } from './Song';
import { SongBeatmapContents } from './SongBeatmapContents';

@Entity('song_beatmaps', { schema: 'superstar_log' })
export class SongBeatmap {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'song_id', unsigned: true })
  songId: number;

  @Column('varchar', { name: 'difficulty', length: 255 })
  difficulty: string;

  @Column('varchar', { name: 'dalcom_beatmap_filename', length: 255 })
  beatmapFilename: string;

  @Column('int', { name: 'index_beat_max', unsigned: true })
  indexBeatMax: number;

  @Column('int', { name: 'index_beat_min', unsigned: true })
  indexBeatMin: number;

  @Column('int', { name: 'count_notes_total', unsigned: true })
  countNotesTotal: number;

  @Column('int', {
    name: 'count_notes_total_raw',
    unsigned: true,
    comment: 'including all bullshit from the beatmaps',
  })
  countNotesTotalRaw: number;

  @Column('int', { name: 'count_notes_nocombo', unsigned: true })
  countNotesNocombo: number;

  @Column('int', { name: 'count_taps', unsigned: true })
  countTaps: number;

  @Column('int', { name: 'count_sliders_nocombo', unsigned: true })
  countSlidersNocombo: number;

  @Column('int', { name: 'count_sliders_total', unsigned: true })
  countSlidersTotal: number;

  @Column('datetime', {
    name: 'beatmap_date_processed',
    comment: 'date when the beatmap has been processed',
    default: () => 'CURRENT_TIMESTAMP',
  })
  beatmapDateProcessed: Date;

  @Column('smallint', {
    name: 'difficulty_id',
    unsigned: true,
  })
  difficultyId: string;

  @Column('varchar', { name: 'dalcom_beatmap_fingerprint', length: 255 })
  beatmapFingerprint: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
    default: null,
  })
  seqUrl: string | null;

  @Column('varchar', {
    length: 255,
    nullable: true,
    default: null,
  })
  mapUrl: string | null;

  @Column('json', { default: '{}', select: false })
  meta: any;

  @Column('varchar', {
    unique: true,
    length: 255,
  })
  guid: string;

  @ManyToOne(() => Song, songs => songs.beatmaps, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'song_id', referencedColumnName: 'id' }])
  song: Song;

  @OneToOne(() => SongBeatmapContents, contents => contents.songBeatmap, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  data: SongBeatmapContents;
}
