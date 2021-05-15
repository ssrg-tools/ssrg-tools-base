import { Column, Entity } from 'typeorm';
import {
  AssetGuidOptionalRef,
  AssetGuidRef,
  Base,
  LocaleString,
} from './helpers';

@Entity('gamedata_music')
export class Music extends Base {
  @Column(() => LocaleString)
  localeName: LocaleString;
  @Column(() => LocaleString)
  localeDisplayGroupName: LocaleString;
  @Column(() => LocaleString)
  albumName: LocaleString;
  @Column()
  analyticsData: string;

  @Column(() => AssetGuidRef)
  sound: AssetGuidRef;
  @Column(() => AssetGuidRef)
  previewSound: AssetGuidRef;
  @Column(() => AssetGuidOptionalRef)
  seqHard: AssetGuidOptionalRef;
  @Column(() => AssetGuidOptionalRef)
  seqNormal: AssetGuidOptionalRef;
  @Column(() => AssetGuidOptionalRef)
  seqEasy: AssetGuidOptionalRef;
  @Column(() => AssetGuidRef)
  image: AssetGuidRef;
  @Column(() => AssetGuidRef)
  album: AssetGuidRef;

  @Column('simple-json', { comment: 'references artist' })
  artistCode: number[];
  @Column({ comment: 'references group' })
  groupData: number;
  @Column()
  myrecordQualifyingScore: number;
  @Column()
  worldrecordQualifyingScore: number;
  @Column('varchar', { nullable: true })
  linkedMusic?: any;
  @Column()
  albumFontColor: string;

  @Column()
  trackNumber: number;
  @Column()
  releaseDate: Date;
  @Column('varchar', { nullable: true })
  composer?: any;
  @Column()
  isMultiTempo: boolean;

  @Column()
  hardPatternCount: number;
  @Column()
  normalPatternCount: number;
  @Column()
  easyPatternCount: number;

  @Column()
  challengable: boolean;
  @Column()
  isHidden: boolean;
  @Column()
  isLocked: boolean;

  @Column()
  orderIndex: number;
  @Column()
  secondOrderIndex: number;

  @Column('float')
  cardRotation: number;
  @Column()
  musicType: string;
  @Column()
  albumBgColor: string;
  @Column('float')
  oneStarMaxMiss: number;
  @Column('float')
  twoStarMaxMiss: number;
  @Column('float')
  threeStarMaxMiss: number;
}
