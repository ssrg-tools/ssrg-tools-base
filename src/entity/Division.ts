import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LeagueRanking } from './LeagueRanking';
import { SongClearsV2 } from './SongClear';

@Index('guid', ['guid'], { unique: true })
@Entity('divisions', { schema: 'superstar_log' })
export class Divisions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('enum', { name: 'group', enum: ['Bronze', 'Silver', 'Gold'] })
  group: 'Bronze' | 'Silver' | 'Gold';

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('decimal', {
    name: 'rp_bonus',
    precision: 1,
    scale: 1,
    default: () => '\'0.0\'',
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

  @OneToMany(() => SongClearsV2, (songClearsV2) => songClearsV2.division)
  songClearsVs: SongClearsV2[];
}
