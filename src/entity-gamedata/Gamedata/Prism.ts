import { Column, Entity } from 'typeorm';
import { AssetGuidRef, Base, LocaleString } from './helpers';

@Entity('gamedata_prism')
export class Prism extends Base {
  @Column(() => LocaleString)
  prismLocale: LocaleString;

  @Column(() => AssetGuidRef)
  prismImageLarge: AssetGuidRef;

  @Column()
  serverDataUse: boolean;

  @Column(() => AssetGuidRef)
  prismImageSmall: AssetGuidRef;
}
