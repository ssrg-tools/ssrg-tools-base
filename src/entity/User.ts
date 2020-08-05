import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LeagueRanking } from './LeagueRanking';
import { LogCredits } from './LogCredit';
import { LogDiamonds } from './LogDiamond';
import { LogDiamondsAds } from './LogDiamondAd';
import { LogDrops } from './CardDrop';
import { SongClearsV2 } from './SongClear';
import { UserCredentials } from './UserCredential';

@Index('username_UNIQUE', ['username'], { unique: true })
@Index('id_UNIQUE', ['id'], { unique: true })
@Index('BY_GUID', ['guid'], { unique: true })
@Entity('users', { schema: 'superstar_log' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'username', unique: true, length: 100 })
  username: string;

  @Column('datetime', { name: 'created', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column('datetime', { name: 'modified', default: () => 'CURRENT_TIMESTAMP' })
  modified: Date;

  @Column('datetime', { name: 'last_login', nullable: true })
  lastLogin: Date | null = null;

  @Column('varchar', { name: 'email', length: 255 })
  email: string;

  @Column('varchar', {
    name: 'timezone',
    length: 255,
    default: () => '\'Europe/Berlin\'',
  })
  timezone: string;

  @Column('tinyint', { name: 'active', default: () => '\'1\'' })
  active: number;

  @Column('varchar', { name: 'guid', unique: true, length: 255 })
  guid: string;

  @OneToMany(() => LeagueRanking, (leagueRanking) => leagueRanking.user)
  leagueRankings: LeagueRanking[] = [];

  @OneToMany(() => LogCredits, (logCredits) => logCredits.user)
  logCredits: LogCredits[] = [];

  @OneToMany(() => LogDiamonds, (logDiamonds) => logDiamonds.user)
  logDiamonds: LogDiamonds[] = [];

  @OneToMany(() => LogDiamondsAds, (logDiamondsAds) => logDiamondsAds.user)
  logDiamondsAds: LogDiamondsAds[] = [];

  @OneToMany(() => LogDrops, (logDrops) => logDrops.user)
  logDrops: LogDrops[] = [];

  @OneToMany(() => SongClearsV2, (songClearsV2) => songClearsV2.user)
  songClearsVs: SongClearsV2[] = [];

  @OneToMany(() => UserCredentials, (userCredentials) => userCredentials.user)
  userCredentials: UserCredentials[] = [];
}
