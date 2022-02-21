import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { EncryptedVarchar } from '../entity-helpers';
import { SqlBool } from '../types';
import { CardDrop } from './CardDrop';
import { File } from './Files/File';
import { LeagueRanking } from './LeagueRanking';
import { LogCredit } from './LogCredit';
import { LogDiamond } from './LogDiamond';
import { LogDiamondAd } from './LogDiamondAd';
import { SongClear } from './SongClear';
import { SongWorldRecord } from './SongWorldRecord';
import { SuperstarGame } from './SuperstarGame';
import { UserCredential } from './UserCredential';
import { UserLogin } from './UserLogin';
import { UserVerification } from './UserVerification';

@Entity('users', { schema: 'superstar_log' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'username', unique: true, length: 100 })
  username: string;

  @Column('tinyint', { unsigned: true, default: 0, width: 1 })
  profilePublic: SqlBool;

  @Column('tinyint', { unsigned: true, default: 0, width: 1 })
  balancePublic: SqlBool;

  @Column('tinyint', { unsigned: true, default: 0, width: 1 })
  dropsPublic: SqlBool;

  @Column('tinyint', { unsigned: true, default: 0, width: 1 })
  playsPublic: SqlBool;

  @Column('tinyint', { unsigned: true, default: 0, width: 1 })
  forceDarkMode: SqlBool;

  @Column('datetime', { name: 'created', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column('datetime', { name: 'modified', default: () => 'CURRENT_TIMESTAMP' })
  modified: Date;

  @Column('datetime', { name: 'last_login', nullable: true })
  lastLogin: Date | null;

  @Column(() => EncryptedVarchar)
  email: EncryptedVarchar;

  @Column('varchar', {
    name: 'timezone',
    length: 255,
    nullable: true,
  })
  timezone: string | null;

  @Column('tinyint', { default: 1, width: 1 })
  active: SqlBool;

  @Column('tinyint', { unsigned: true, default: 0, width: 1 })
  isAdmin: SqlBool;

  @Column('tinyint', { unsigned: true, default: 0, width: 1 })
  isMod: SqlBool;

  @Column('varchar', { unique: true, length: 255 })
  guid: string;

  @OneToMany(() => LeagueRanking, leagueRanking => leagueRanking.user)
  leagueRankings?: Relation<LeagueRanking>[];

  @OneToMany(() => LogCredit, logCredits => logCredits.user)
  logCredits: Relation<LogCredit>[];

  @OneToMany(() => LogDiamond, logDiamonds => logDiamonds.user)
  logDiamonds: Relation<LogDiamond>[];

  @OneToMany(() => LogDiamondAd, logDiamondsAds => logDiamondsAds.user)
  logDiamondsAds: Relation<LogDiamondAd>[];

  @OneToMany(() => CardDrop, logDrops => logDrops.user)
  logDrops: Relation<CardDrop>[];

  @OneToMany(() => SongClear, songClearsV2 => songClearsV2.user)
  songClears: Relation<SongClear>[];

  @OneToMany(() => SongWorldRecord, songWorldRecord => songWorldRecord.observer)
  observedSongWorldRecords: Relation<SongWorldRecord>[];

  @OneToMany(() => UserCredential, userCredentials => userCredentials.user)
  userCredentials: Relation<UserCredential>[];

  @OneToMany(() => UserLogin, userLogin => userLogin.user)
  logins: Relation<UserLogin>[];

  @OneToMany(() => UserVerification, verification => verification.user)
  verifications: Relation<UserVerification>[];

  @OneToMany(() => File, file => file.user)
  files: Relation<File>[];

  @ManyToMany(() => SuperstarGame)
  @JoinTable()
  activeGames: Relation<SuperstarGame>[];
}

/** allow alphanumeric, underscore and Hangul, at least 3 digits */
export const regexpUsername = /^[\w_\u3131-\uD79D]{3,50}$/u;
