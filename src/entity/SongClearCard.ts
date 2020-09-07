import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SongClear } from './SongClear';
import { Theme } from './Theme';
import { Grade, MembersGFriend, SqlBool } from './../types';

@Index(['songClearId', 'member'], { unique: true })
@Index(['songClearId', 'rotationOrder'], {
  unique: true,
})
@Entity('song_clear_cards', { schema: 'superstar_log' })
export class SongClearCard {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'song_clear_id', unsigned: true })
  songClearId: number;

  @Column('smallint', {
    name: 'rotation_order',
    nullable: true,
    unsigned: true,
  })
  rotationOrder: number | null;

  @Column('enum', {
    name: 'member',
    enum: MembersGFriend.values,
    nullable: true,
  })
  member: typeof MembersGFriend.type;

  @Column('int', { name: 'score', unsigned: true })
  score: number;

  @Column('int', { name: 'theme_id', nullable: true, unsigned: true })
  themeId: number | null;

  @Column('enum', {
    name: 'grade',
    enum: Grade,
    default: '\'S\'',
  })
  grade: Grade;

  @Column('smallint', {
    name: 'level',
    nullable: true,
    unsigned: true,
    default: 1,
  })
  level: number | null;

  @Column('tinyint', { name: 'is_prism', unsigned: true, default: 0 })
  isPrism: SqlBool;

  @Column('varchar', {
    name: 'guid',
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @ManyToOne(
    () => SongClear,
    (songClear) => songClear.cards,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ name: 'song_clear_id', referencedColumnName: 'id' }])
  songClear: SongClear;

  @ManyToOne(() => Theme, (themes) => themes.songClearCards, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'theme_id', referencedColumnName: 'id' }])
  theme: Theme;
}
