import { Column } from "typeorm";

export class AssetGuidOptionalRef {
  @Column('varchar', { length: 50, comment: 'game asset guid', nullable: true })
  assetGuid?: string;
}
