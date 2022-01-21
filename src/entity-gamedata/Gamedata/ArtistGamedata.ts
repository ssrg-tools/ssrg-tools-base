import { Column, Entity } from 'typeorm';
import { AssetGuidRef, Base, LocaleString } from './helpers';

/**
 * Maps to ArtistMember
 */
@Entity('gamedata_artist')
export class ArtistGamedata extends Base {
  @Column(() => LocaleString)
  birthday: LocaleString;

  @Column()
  analyticsData: string;

  @Column(() => AssetGuidRef)
  nameImage: AssetGuidRef;

  @Column()
  isProfileImage: boolean;

  @Column(() => AssetGuidRef)
  emptyImageLarge: AssetGuidRef;

  @Column(() => AssetGuidRef)
  emptyImageSmall: AssetGuidRef;

  @Column(() => AssetGuidRef)
  profileImage: AssetGuidRef;

  @Column(() => LocaleString)
  debut: LocaleString;

  @Column()
  orderIndex: number;

  @Column(() => LocaleString)
  debutAlbum: LocaleString;

  @Column('varchar', { nullable: true })
  position?: any;

  @Column(() => LocaleString)
  localeName: LocaleString;

  @Column()
  group: number;
}
