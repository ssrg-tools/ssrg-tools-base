import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Songs } from './Song';
import { Divisions } from './Division';
import { User } from './User';
import { SongClearCards } from './SongClearCard';

@Index('guid', ['guid'], { unique: true })
@Index('FK__songs', ['songId'], {})
@Index('FK_song_clears_v2_divisions', ['divisionId'], {})
@Index('FK_song_clears_v2_users', ['userId'], {})
@Entity('song_clears_v2', { schema: 'superstar_log' })
export class SongClearsV2 {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

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

  @Column('int', { name: 'stars', unsigned: true, default: () => '\'3\'' })
  stars: number;

  @Column('enum', {
    name: 'difficulty',
    enum: ['Easy', 'Normal', 'Hard'],
    default: () => '\'Normal\'',
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
    default: () => '\'0\'',
  })
  hitGood: number | null;

  @Column('int', {
    name: 'hit_miss',
    nullable: true,
    unsigned: true,
    default: () => '\'0\'',
  })
  hitMiss: number | null;

  @Column('int', { name: 'hit_score', nullable: true, unsigned: true })
  hitScore: number | null;

  @Column('int', { name: 'theme_level', unsigned: true, default: () => '\'3\'' })
  themeLevel: number;

  @Column('tinyint', {
    name: 'is_challenge',
    unsigned: true,
    default: () => '\'0\'',
  })
  isChallenge: number;

  @Column('tinyint', {
    name: 'has_bonus',
    unsigned: true,
    default: () => '\'0\'',
  })
  hasBonus: number;

  @Column('tinyint', {
    name: 'watched_ads',
    unsigned: true,
    default: () => '\'1\'',
  })
  watchedAds: number;

  @Column('int', {
    name: 'theme_buff_bonus',
    unsigned: true,
    default: () => '\'5000\'',
  })
  themeBuffBonus: number;

  @Column('int', {
    name: 'score_theme_grade_bonus',
    unsigned: true,
    default: () => '\'545000\'',
  })
  scoreThemeGradeBonus: number;

  @Column('int', { name: 'division_id', unsigned: true, default: () => '\'5\'' })
  divisionId: number;

  @Column('int', {
    name: 'user_id',
    unsigned: true,
    default: () => '\'20150115\'',
  })
  userId: number;

  @Column('longtext', { name: 'meta', default: () => '\'{}\'' })
  meta: string;

  @Column('varbinary', {
    name: 'guid',
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: Buffer | null;

  @ManyToOne(() => Songs, (songs) => songs.songClearsVs, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'song_id', referencedColumnName: 'id' }])
  song: Songs;

  @ManyToOne(() => Divisions, (divisions) => divisions.songClearsVs, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'division_id', referencedColumnName: 'id' }])
  division: Divisions;

  @ManyToOne(() => User, (users) => users.songClearsVs, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => SongClearCards, (songClearCards) => songClearCards.songClear)
  songClearCards: SongClearCards[];
}
