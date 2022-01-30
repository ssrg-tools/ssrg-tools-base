import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { LeagueRanking } from './LeagueRanking';
import { LeagueTrackerEntry } from './LeagueTrackerEntry';
import { SongClear } from './SongClear';
import { SuperstarGame } from './SuperstarGame';

@Entity('divisions', { schema: 'superstar_log' })
export class Division {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('enum', {
    name: 'group',
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Master'],
  })
  group: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Master';

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('decimal', {
    name: 'rp_bonus',
    precision: 2,
    scale: 1,
    default: 0.0,
  })
  rpBonus: string;

  @Column('int', { name: 'order', unsigned: true })
  order: number;

  @Column('int', {
    name: 'group_order',
    comment: 'order within the group',
    unsigned: true,
  })
  groupOrder: number;

  @Column('varchar', {
    name: 'guid',
    unique: true,
    length: 255,
  })
  guid: string;

  @OneToMany(() => LeagueRanking, leagueRanking => leagueRanking.division)
  leagueRankings: LeagueRanking[];

  @OneToMany(() => LeagueTrackerEntry, leagueTrackerEntry => leagueTrackerEntry.division)
  leagueTrackerEntries: LeagueTrackerEntry[];

  @OneToMany(() => SongClear, songClearsV2 => songClearsV2.division)
  songClears: SongClear[];

  @ManyToMany(() => SuperstarGame)
  games: SuperstarGame[];
}
