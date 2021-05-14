import { SqlBool } from '../../types';
import { Column, Entity } from 'typeorm';
import { AssetGuidRef, Base } from './helpers';

@Entity('gamedata_card')
export class Card extends Base {
  @Column()
  intensifyPercentage: number;

  @Column()
  groupID: number;

  @Column()
  artistID: number;

  @Column()
  isSelect: boolean;

  @Column(() => AssetGuidRef)
  cardImageLarge: AssetGuidRef;

  @Column(() => AssetGuidRef)
  cardImageSmall: AssetGuidRef;

  @Column()
  type: number;

  @Column('tinyint')
  material: SqlBool;

  @Column()
  sellStartAt: Date;

  @Column()
  sellEndAt: Date;

  @Column('float')
  percentage: number;

  @Column()
  theme: number;

  @Column('tinyint', { nullable: true })
  prism?: SqlBool;
}
