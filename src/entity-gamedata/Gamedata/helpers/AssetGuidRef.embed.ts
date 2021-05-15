import { Column } from 'typeorm';

export class AssetGuidRef {
  @Column('varchar', { length: 50, comment: 'game asset guid' })
  assetGuid: string;
}
