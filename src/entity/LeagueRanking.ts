import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Division } from './Division';
import { User } from './User';
import { SuperstarGame } from './SuperstarGame';

/** possibly deprecated */
@Entity('league_ranking', { schema: 'superstar_log' })
export class LeagueRanking {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'score', unsigned: true })
  score: number;

  @Column('int', { name: 'rank', unsigned: true })
  rank: number;

  @Column('int', { name: 'diff_above', nullable: true, unsigned: true })
  diffAbove: number | null;

  @Column('int', { name: 'diff_below', nullable: true, unsigned: true })
  diffBelow: number | null;

  @Column({
    type: 'int',
    name: 'score_above',
    nullable: true,
    unsigned: true,
    generatedType: 'STORED',
    asExpression: '`score` + `diff_above`',
  })
  scoreAbove: number | null;

  @Column({
    type: 'int',
    name: 'score_below',
    nullable: true,
    unsigned: true,
    generatedType: 'STORED',
    asExpression: '`score` - `diff_below`',
  })
  scoreBelow: number | null;

  @Index('byDate')
  @Column('datetime', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('int', { name: 'division_id', unsigned: true })
  divisionId: number;

  @Column('varchar', { name: 'comment', nullable: true, length: 255 })
  comment: string | null;

  @Column('longtext', { name: 'meta', nullable: true })
  meta: string | null;

  @Column('int', {
    name: 'user_id',
    unsigned: true,
    nullable: true,
    default: 20150115,
  })
  userId?: number;

  @Column('int', { name: 'game_id', unsigned: true })
  gameId: number;

  @Column('varchar', {
    name: 'guid',
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @ManyToOne(() => Division, (divisions) => divisions.leagueRankings, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'division_id', referencedColumnName: 'id' }])
  division: Division;

  @ManyToOne(() => User, (users) => users.leagueRankings, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => SuperstarGame,
    (superstarGames) => superstarGames.leagueRankings,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ name: 'game_id', referencedColumnName: 'id' }])
  game: SuperstarGame;
}
