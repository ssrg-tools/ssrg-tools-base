import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, Unique } from 'typeorm';
import { Beatmap } from '../seq';
import { SongBeatmap } from './SongBeatmap';

@Entity('song_beatmap_contents', { schema: 'superstar_log' })
@Unique(['id', 'parserVersion'])
export class SongBeatmapContents {
  @PrimaryColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('int', { unsigned: true })
  parserVersion: number;

  @Column('json')
  data: Beatmap;

  @Column('datetime', {
    comment: 'date when the beatmap has been processed',
    default: () => 'CURRENT_TIMESTAMP',
  })
  beatmapDateProcessed: Date;

  @Column('varchar', { length: 255 })
  beatmapFingerprint: string;

  @Column('json', { default: '{}', select: false })
  meta: any;

  @Column('varchar', {
    unique: true,
    length: 255,
  })
  guid: string;

  @OneToOne(() => SongBeatmap, beatmap => beatmap.data)
  @JoinColumn([{ name: 'id', referencedColumnName: 'id' }])
  songBeatmap: SongBeatmap;
}
