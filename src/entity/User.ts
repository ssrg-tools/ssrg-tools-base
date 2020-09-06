import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LeagueRanking } from './LeagueRanking';
import { LogCredit } from './LogCredit';
import { LogDiamond } from './LogDiamond';
import { LogDiamondAd } from './LogDiamondAd';
import { CardDrop } from './CardDrop';
import { SongClear } from './SongClear';
import { UserCredential } from './UserCredential';
import { SqlBool } from '../types';

@Entity('users', { schema: 'superstar_log' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'username', unique: true, length: 100 })
  username: string;

  @Column('tinyint', { unsigned: true, default: 0 })
  profilePublic: SqlBool;

  @Column('tinyint', { unsigned: true, default: 0 })
  balancePublic: SqlBool;

  @Column('tinyint', { unsigned: true, default: 0 })
  dropsPublic: SqlBool;

  @Column('tinyint', { unsigned: true, default: 0 })
  playsPublic: SqlBool;

  @Column('datetime', { name: 'created', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column('datetime', { name: 'modified', default: () => 'CURRENT_TIMESTAMP' })
  modified: Date;

  @Column('datetime', { name: 'last_login', nullable: true })
  lastLogin: Date | null;

  @Column('varchar', { name: 'email', length: 255 })
  email: string;

  @Column('varchar', {
    name: 'timezone',
    length: 255,
    default: () => '\'Europe/Berlin\'',
  })
  timezone: string;

  @Column('tinyint', { name: 'active', default: () => 1 })
  active: SqlBool;

  @Column('tinyint', { unsigned: true, default: 0 })
  isAdmin: SqlBool;

  @Column('tinyint', { unsigned: true, default: 0 })
  isMod: SqlBool;

  @Column('varchar', { name: 'guid', unique: true, length: 255 })
  guid: string | null;

  @OneToMany(() => LeagueRanking, (leagueRanking) => leagueRanking.user)
  leagueRankings?: LeagueRanking[];

  @OneToMany(() => LogCredit, (logCredits) => logCredits.user)
  logCredits: LogCredit[];

  @OneToMany(() => LogDiamond, (logDiamonds) => logDiamonds.user)
  logDiamonds: LogDiamond[];

  @OneToMany(() => LogDiamondAd, (logDiamondsAds) => logDiamondsAds.user)
  logDiamondsAds: LogDiamondAd[];

  @OneToMany(() => CardDrop, (logDrops) => logDrops.user)
  logDrops: CardDrop[];

  @OneToMany(() => SongClear, (songClearsV2) => songClearsV2.user)
  songClearsVs: SongClear[];

  @OneToMany(() => UserCredential, (userCredentials) => userCredentials.user)
  userCredentials: UserCredential[];
}
