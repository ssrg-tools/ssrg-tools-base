import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Song } from './Song';
import { Division } from './Division';
import { User } from './User';
import { SongClearCard } from './SongClearCard';
import { SqlBool } from '../types';

@Entity('song_clears_v2', { schema: 'superstar_log' })
export class SongClear {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Index('byDate')
  @Column('datetime', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('int', { name: 'song_id', unsigned: true })
  songId: number;

  @Column('int', { name: 'rp_base', nullable: true, unsigned: true })
  rpBase: number | null;

  @Column('int', { name: 'rp_total', nullable: true, unsigned: true })
  rpTotal: number | null;

  @Column('int', { name: 'rp_bonus', nullable: true, unsigned: true })
  rpBonus: number | null;

  @Column('int', { name: 'score_total', unsigned: true })
  scoreTotal: number;

  @Column('int', {
    name: 'score_base',
    nullable: true,
    comment: 'this field can not be relied upon if hit_miss is not zero',
    unsigned: true,
  })
  scoreBase: number | null;

  @Column('int', {
    name: 'score_rave_bonus',
    nullable: true,
    comment: 'this field can not be relied upon if hit_miss is not zero',
    unsigned: true,
  })
  scoreRaveBonus: number | null;

  @Column('int', { name: 'score_bonus', nullable: true, unsigned: true })
  scoreBonus: number | null;

  @Column('int', { name: 'stars', unsigned: true })
  stars: number;

  @Column('enum', {
    name: 'difficulty',
    enum: ['Easy', 'Normal', 'Hard'],
  })
  difficulty: 'Easy' | 'Normal' | 'Hard';

  @Column('int', { name: 'hit_super_perfect', nullable: true, unsigned: true })
  hitSuperPerfect: number | null;

  @Column('int', { name: 'hit_perfect', nullable: true, unsigned: true })
  hitPerfect: number | null;

  @Column('int', {
    name: 'hit_good',
    nullable: true,
    unsigned: true,
  })
  hitGood: number | null;

  @Index('byHitMiss')
  @Column('int', {
    name: 'hit_miss',
    nullable: true,
    unsigned: true,
  })
  hitMiss: number | null;

  @Column({
    type: 'int',
    unsigned: false,
    name: 'hit_score',
    generatedType: 'VIRTUAL',
    asExpression: '2 * `hit_super_perfect` + 1 * `hit_perfect` + 0.5 * `hit_good` + -10 * `hit_miss`',
  })
  hitScore: number | null;

  @Column('int', { name: 'theme_level', unsigned: true, nullable: true })
  themeLevel: number;

  @Column('tinyint', {
    name: 'is_challenge',
    unsigned: true,
    default: 0,
  })
  isChallenge: SqlBool;

  @Column('tinyint', {
    name: 'has_bonus',
    unsigned: true,
    default: 0,
  })
  hasBonus: SqlBool;

  @Column('tinyint', {
    name: 'watched_ads',
    unsigned: true,
    default: 1,
  })
  watchedAds: SqlBool;

  @Column('int', {
    name: 'theme_buff_bonus',
    unsigned: true,
    nullable: true,
  })
  themeBuffBonus: number;

  @Column('int', {
    name: 'score_theme_grade_bonus',
    unsigned: true,
    nullable: true,
  })
  scoreThemeGradeBonus: number;

  @Column('int', { name: 'division_id', unsigned: true, nullable: true })
  divisionId?: number;

  @Column('int', {
    name: 'user_id',
    unsigned: true,
    default: 20150115,
  })
  userId: number;

  @Column('longtext', { name: 'meta', default: '\'{}\'' })
  meta: string;

  @Column('varchar', {
    name: 'guid',
    nullable: true,
    unique: true,
    length: 255,
  })
  guid?: string;

  @ManyToOne(() => Song, (songs) => songs.songClears, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'song_id', referencedColumnName: 'id' }])
  song: Song;

  @ManyToOne(() => Division, (divisions) => divisions.songClears, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'division_id', referencedColumnName: 'id' }])
  division?: Division;

  @ManyToOne(() => User, (users) => users.songClears, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => SongClearCard, (songClearCard) => songClearCard.songClear)
  cards: SongClearCard[];
}
