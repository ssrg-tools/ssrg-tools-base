import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { LeagueRanking } from './LeagueRanking';
import { SongClear } from './SongClear';
import { SuperstarGame } from './SuperstarGame';

@Index(['guid'], { unique: true })
@Entity('divisions', { schema: 'superstar_log' })
export class Division {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('enum', { name: 'group', enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Master'] })
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
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @OneToMany(() => LeagueRanking, (leagueRanking) => leagueRanking.division)
  leagueRankings: LeagueRanking[];

  @OneToMany(() => SongClear, (songClearsV2) => songClearsV2.division)
  songClearsVs: SongClear[];

  @ManyToMany(type => SuperstarGame)
  games: SuperstarGame[];
}
