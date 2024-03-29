import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinTable, Relation } from 'typeorm';
import { LeagueRanking } from './LeagueRanking';
import { LogCredit } from './LogCredit';
import { LogDiamond } from './LogDiamond';
import { LogDiamondAd } from './LogDiamondAd';
import { CardDrop } from './CardDrop';
import { Song } from './Song';
import { Theme } from './Theme';
import { Division } from './Division';
import { SqlBool } from '../types';
import { LeagueTrackerEntry } from './LeagueTrackerEntry';
import { Artist } from './Artist';
import { GamePopulation } from './GamePopulation';
import { PlayerProfile } from './PlayerProfile';
import { GameArchivedAssetLink } from './Archive/GameArchivedAssetLink';

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

  @Column('smallint', {
    name: 'max_r_level',
    nullable: true,
    unsigned: true,
    default: 50,
  })
  maxRLevel: string | null;

  @Index('byKey')
  @Column('varchar', {
    name: 'key',
    length: 50,
    comment: 'used for urls and internal tools',
  })
  key: string;

  @Column('varchar', {
    length: 255,
  })
  tagline: string;

  @Column('tinyint', {
    unsigned: true,
    default: 1,
    comment: 'whether this entry is active in the application and should be displayed and interacted with',
  })
  active: SqlBool;

  @Column('date', {
    nullable: true,
  })
  dateReleased: Date;

  @Column('tinyint', {
    unsigned: true,
    default: 0,
  })
  hasPrism: SqlBool;

  @Column('tinyint', {
    unsigned: true,
    default: 0,
  })
  isSingleArtistGame: SqlBool;

  @Column('varchar', {
    length: 255,
    default: 'common',
    select: false,
  })
  xpSystem: 'common' | 'bts';

  @Column('varchar', {
    nullable: true,
    length: 255,
    select: false,
  })
  comment: string | null;

  @Column('longtext', {
    nullable: true,
    select: false,
  })
  meta: string | null;

  @Column('varchar', {
    length: 255,
  })
  apkName: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
    select: false,
    comment: 'game encryption key in clear text',
  })
  encryptionKey: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
    select: false,
  })
  appVersionAndroid: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
    select: false,
  })
  appVersionIOS: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
    select: false,
    comment: 'folder to manifest',
  })
  baseUrlManifest: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
    select: false,
    comment: 'base url to world record info',
  })
  baseUrlRanking: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
    select: false,
    comment: 'link to game assets',
  })
  baseUrlAssets: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
    select: false,
    comment: 'main assets base url',
  })
  baseUrlBucketAssets: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
    select: false,
    comment: 'main CDN base url',
  })
  baseUrlBucketCdn: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
    select: false,
    comment: 'game api endpoint',
  })
  baseUrlApi: string;

  @Column('simple-array', { select: false, default: '' })
  s3Buckets: string[];

  @Column('varchar', {
    unique: true,
    length: 255,
  })
  guid: string;

  @OneToMany(() => LeagueRanking, leagueRanking => leagueRanking.game)
  leagueRankings: Relation<LeagueRanking>[];

  @OneToMany(() => LeagueTrackerEntry, leagueTrackerEntry => leagueTrackerEntry.game)
  leagueTrackerEntries: Relation<LeagueTrackerEntry>[];

  @OneToMany(() => LogCredit, logCredits => logCredits.game)
  logCredits: Relation<LogCredit>[];

  @OneToMany(() => LogDiamond, logDiamonds => logDiamonds.game)
  logDiamonds: Relation<LogDiamond>[];

  @OneToMany(() => LogDiamondAd, logDiamondsAds => logDiamondsAds.game)
  logDiamondsAds: Relation<LogDiamondAd>[];

  @OneToMany(() => CardDrop, logDrops => logDrops.game)
  logDrops: Relation<CardDrop>[];

  @OneToMany(() => Song, songs => songs.game)
  songs: Relation<Song>[];

  @OneToMany(() => Theme, themes => themes.game)
  themes: Relation<Theme>[];

  @OneToMany(() => Artist, artist => artist.game)
  artists: Relation<Artist>[];

  @OneToMany(() => GamePopulation, pop => pop.game)
  populationHistory: Relation<GamePopulation>[];

  @OneToMany(() => PlayerProfile, pop => pop.game)
  playerProfiles: Relation<PlayerProfile>[];

  @OneToMany(() => GameArchivedAssetLink, dataFileLink => dataFileLink.game)
  gameArchivedAssetLinks: Relation<GameArchivedAssetLink>[];

  @ManyToMany(() => Division)
  @JoinTable()
  divisions: Relation<Division>[];
}
