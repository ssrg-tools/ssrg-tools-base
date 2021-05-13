import { Column, Entity } from 'typeorm';
import { Base, LocaleString, AssetGuidRef } from './helpers';

/**
 * Maps to Artists
 */
@Entity('gamedata_group')
export class Group extends Base {
  @Column(() => LocaleString)
  localeName: LocaleString;

  @Column(() => LocaleString)
  profileGroupName: LocaleString;

  @Column(() => LocaleString)
  cardLocaleName: LocaleString;

  @Column()
  analyticsData: string;

  @Column(() => AssetGuidRef)
  bestCardbookImage: AssetGuidRef;

  @Column()
  groupType: number;

  @Column({ nullable: true })
  integrateCode?: string;

  @Column({ nullable: true })
  displayStartAt?: Date;

  @Column({ nullable: true })
  displayEndAt?: Date;

  @Column({ nullable: true })
  emblemIndex?: number;

  @Column({ nullable: true })
  emblemBuiltInResId: string;

  @Column(() => AssetGuidRef)
  emblemImage: AssetGuidRef;

  @Column()
  equipableSlot: number;

  @Column()
  orderIndex: number;

  @Column()
  secondOrderIndex: number;
}
