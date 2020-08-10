import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LeagueRanking } from './LeagueRanking';
import { LogCredit } from './LogCredit';
import { LogDiamond } from './LogDiamond';
import { LogDiamondAd } from './LogDiamondAd';
import { CardDrop } from './CardDrop';
import { Song } from './Song';
import { Theme } from './Theme';

@Index(['guid'], { unique: true })
@Entity('superstar_games', { schema: 'superstar_log' })
export class SuperstarGame {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', {
    name: 'name',
    length: 255,
    default: 'SuperStar ',
  })
  name: string;

  @Column('varchar', { name: 'comment', nullable: true, length: 255 })
  comment: string | null;

  @Column('longtext', { name: 'meta', nullable: true })
  meta: string | null;

  @Column('smallint', {
    name: 'max_r_level',
    nullable: true,
    unsigned: true,
    default: 50,
  })
  maxRLevel: string | null;

  @Column('varchar', {
    name: 'guid',
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @OneToMany(() => LeagueRanking, (leagueRanking) => leagueRanking.game)
  leagueRankings: LeagueRanking[];

  @OneToMany(() => LogCredit, (logCredits) => logCredits.game)
  logCredits: LogCredit[];

  @OneToMany(() => LogDiamond, (logDiamonds) => logDiamonds.game)
  logDiamonds: LogDiamond[];

  @OneToMany(() => LogDiamondAd, (logDiamondsAds) => logDiamondsAds.game)
  logDiamondsAds: LogDiamondAd[];

  @OneToMany(() => CardDrop, (logDrops) => logDrops.game)
  logDrops: CardDrop[];

  @OneToMany(() => Song, (songs) => songs.game)
  songs: Song[];

  @OneToMany(() => Theme, (themes) => themes.game)
  themes: Theme[];
}
