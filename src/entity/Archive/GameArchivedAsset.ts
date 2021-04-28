import { Index, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, OneToOne } from 'typeorm';
import { File } from '../Files/File';
import { SuperstarGame } from '../SuperstarGame';

@Unique('byGuid', ['guid'])
  @Unique('byVersionsAndCode', ['gameId', 'gameAssetVersion', 'gameSubAssetVersion', 'originalCode'])
  @Unique('byFileId', ['fileId'])
@Entity('files_gameasset_archive', { schema: 'superstar_log' })
export class GameArchivedAsset {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('int', { unsigned: true })
  gameId: number;

  @Column('int', { unsigned: true })
  fileId: number;

  /** version of the info file */
  @Column('int', { unsigned: true })
  gameAssetVersion: number;

  /** version of the urls file */
  @Column('int', { unsigned: true })
  gameSubAssetVersion: number;

  @Column('int', { unsigned: true })
  originalCode: number;

  @Index('byDateArchival')
  @Column('datetime', { comment: 'the date this file was entered into the database' })
  dateArchival: Date;

  @Column('varchar', {
    length: 255,
  })
  sourceUrl: string;

  /** version tag from the urls data entry */
  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  sourceVersion: string;

  @Index('bySourceDateModified')
  @Column('datetime', {
    comment: 'the date this file was last modified according to the original entry',
    nullable: true,
  })
  sourceDateModified: Date;

  @Column('varchar', {
    length: 255,
  })
  guid: string;

  @ManyToOne(
    () => SuperstarGame,
    (superstarGames) => superstarGames.archiveSongWorldRecords,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ name: 'gameId', referencedColumnName: 'id' }])
  game: SuperstarGame;

  @OneToOne(
    () => File,
    file => file.gameAsset,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
  )
  @JoinColumn({ name: 'fileId' })
  file: File;
}
