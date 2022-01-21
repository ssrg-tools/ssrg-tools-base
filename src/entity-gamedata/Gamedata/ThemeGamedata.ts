import { Column, Entity } from 'typeorm';
import { AssetGuidRef, Base, LocaleString } from './helpers';

@Entity('gamedata_theme')
export class ThemeGamedata extends Base {
  @Column(() => AssetGuidRef)
  nameImageSmall: AssetGuidRef;

  @Column(() => AssetGuidRef)
  nameImageLarge: AssetGuidRef;

  @Column()
  analyticsData: string;

  @Column()
  themePercentage: number;

  @Column('float')
  selectRate: number;

  @Column()
  orderIndex: number;

  @Column()
  limitedType: number;

  @Column()
  rehearsalTheme: boolean;

  @Column()
  themeTypeCode: number;

  @Column('simple-json', { nullable: true })
  cardbookMarkCode: number[];

  @Column(() => LocaleString)
  localeName: LocaleString;
}
