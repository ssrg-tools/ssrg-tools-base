import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation, Unique } from 'typeorm';
import { File } from '../Files/File';
import { GameArchivedAssetLink } from './GameArchivedAssetLink';

@Unique('byGuid', ['guid'])
@Entity('files_gameasset_archive', { schema: 'superstar_log' })
export class GameArchivedAsset {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('int', { unsigned: true })
  fileId: number;

  @Column('varchar', {
    length: 255,
  })
  sourceUrl: string;

  @Column('varchar', {
    length: 255,
  })
  guid: string;

  @OneToOne(() => File, file => file.gameAsset, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'fileId' })
  file: Relation<File>;

  @OneToMany(() => GameArchivedAssetLink, link => link.asset)
  gamedataFileLinks: Relation<GameArchivedAssetLink>[];
}
