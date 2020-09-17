import { SqlBool } from '../types';
import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Division } from './Division';
import { SuperstarGame } from './SuperstarGame';

@Entity('league_tracker', { schema: 'superstar_log' })
export class LeagueTrackerEntry {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('varchar', { length: 255 })
  nickname: string;

  @Column('int', { unsigned: true })
  score: number;

  @Index('byDate')
  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('int', { unsigned: true })
  divisionId: number;

  @Column('tinyint', { unsigned: true, comment: 'in SSRGs the divisions are divided into two groups' })
  divisionGroup: number;

  @Index('bySSRGDiscord')
  @Column('tinyint', { unsigned: true, width: 1, default: 0 })
  isSSRGDiscord: SqlBool;

  @Column('varchar', { nullable: true, length: 255 })
  comment: string | null;

  @Column('varchar', { nullable: true, length: 255, comment: 'if available, connects people that have been in the same division, e.g. Week 43 Gold III-3' })
  divisionKey: string | null;

  @Column('longtext', { nullable: true })
  meta: string | null;

  @Column('int', { unsigned: true, nullable: true })
  objectID: number;

  @Column('int', { unsigned: true, nullable: true })
  specialUserCode: number;

  @Column('int', { unsigned: true })
  gameId: number;

  @Column('varchar', {
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @ManyToOne(() => Division, (divisions) => divisions.leagueTrackerEntries, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ referencedColumnName: 'id' }])
  division: Division;

  @ManyToOne(
    () => SuperstarGame,
    (superstarGames) => superstarGames.leagueTrackerEntries,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ referencedColumnName: 'id' }])
  game: SuperstarGame;
}
