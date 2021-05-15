import {
  Unique,
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { SuperstarGame } from '../SuperstarGame';
import { GameArchivedAsset } from './GameArchivedAsset';

@Unique('byVersionsAndCode', [
  'gameId',
  'bundleVersion',
  'resourceVersion',
  'originalCode',
])
@Entity('files_gameasset_archive_links', { schema: 'superstar_log' })
export class GameArchivedAssetLink {
  @Column('int', { unsigned: true })
  assetId: number;

  @Column('bigint', { unsigned: true })
  gamedataFileId: bigint;

  /** version of the info file */
  @PrimaryColumn({ type: 'int', unsigned: true })
  bundleVersion: number;

  /** version of the urls file */
  @PrimaryColumn({ type: 'int', unsigned: true })
  resourceVersion: number;

  @PrimaryColumn({ type: 'int', unsigned: true })
  originalCode: number;

  @PrimaryColumn({ type: 'int', unsigned: true })
  gameId: number;

  @Index('byDateArchival')
  @Column('datetime', {
    comment: 'the date this file was entered into the database',
  })
  dateArchival: Date;

  /** version tag from the urls data entry */
  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  sourceVersion: string;

  @Index('bySourceDateModified')
  @Column('datetime', {
    comment:
      'the date this file was last modified according to the original entry',
    nullable: true,
  })
  sourceDateModified: Date;

  @ManyToOne(() => GameArchivedAsset, (asset) => asset.gamedataFileLinks, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'assetId', referencedColumnName: 'id' }])
  asset: GameArchivedAsset;

  @ManyToOne(
    () => SuperstarGame,
    (superstarGames) => superstarGames.gameArchivedAssetLinks,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'gameId', referencedColumnName: 'id' }])
  game: SuperstarGame;
}
