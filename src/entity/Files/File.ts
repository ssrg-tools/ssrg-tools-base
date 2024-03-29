import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  TableInheritance,
  Unique,
} from 'typeorm';
import { GameArchivedAsset } from '../Archive/GameArchivedAsset';
import { User } from '../User';

@Entity('files', { schema: 'superstar_log' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
@Unique('byKey', ['key'])
@Unique('byGuid', ['guid'])
export abstract class File {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  /**
   * Location, respective to the storage engine
   */
  @Column('varchar', { length: 255 })
  key: string;

  @Index('byFingerprint')
  @Column('varchar', { length: 255 })
  fingerprint: string;

  @Column('int', { unsigned: true })
  size: number;

  @Column('varchar', { length: 255, nullable: true })
  mime: string;

  @Column('json', { default: '{}' })
  meta: any;

  /** May control e.g. caching behaviour */
  @Column('varchar', { length: 255, default: 'public' })
  restriction: FileAccessRestriction;

  @Index('byEngine')
  @Column('varchar', { length: 255 })
  engine: FileEngine;

  @Index('byEngineBucket')
  @Column('varchar', { length: 255 })
  engineBucket: string;

  @Index('byDateUploaded')
  @Column('datetime')
  dateUploaded: Date;

  @Column('varchar', { length: 255 })
  guid: string;

  @Column('varchar', { length: 255 })
  type: string;

  @Column('int', {
    unsigned: true,
    nullable: true, // null means system
  })
  userId: number;

  @ManyToOne(() => User, users => users.files, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: Relation<User>;

  @OneToOne(() => GameArchivedAsset, gameAsset => gameAsset.file)
  gameAsset: Relation<GameArchivedAsset>;
}

export interface FileWithUri extends File {
  uri: string;
}

export type FileAccessRestriction = 'public';
export type FileEngine = 'aws-s3';

export function userCanViewAllKeys(user: User) {
  return user && (user.isMod || user.isAdmin);
}

export function hasUri(file: File): file is FileWithUri {
  return (file as any).uri;
}

export function urlForEblob(file: File): string {
  return `/v1/files/eblobs/${file.guid}`;
}
