import { Column, Entity } from 'typeorm';
import { AssetGuidRef, Base } from './helpers';

@Entity('gamedata_themetype')
export class ThemeType extends Base {
  @Column()
  animationTime?: number;

  @Column()
  animationCount?: number;

  @Column(() => AssetGuidRef)
  backgroundImage?: AssetGuidRef;

  @Column('json')
  backgroundAnimation?: AssetGuidRef[];

  @Column('json')
  themePosition?: { x: number; y: number };

  @Column('json')
  emblemPosition: { x: number; y: number };

  @Column('json')
  namePosition?: { x: number; y: number };

  @Column('json')
  gradeC: AssetGuidRef[];

  @Column('json')
  gradeB: AssetGuidRef[];

  @Column('json')
  gradeA: AssetGuidRef[];

  @Column('json')
  gradeS: AssetGuidRef[];

  @Column('json')
  gradeR: AssetGuidRef[];
}
