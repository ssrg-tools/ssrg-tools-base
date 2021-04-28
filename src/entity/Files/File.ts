import { Entity, PrimaryGeneratedColumn, Column, TableInheritance, Index, Unique, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { GameArchivedAsset } from '../Archive/GameArchivedAsset';
import { User } from '../User';

@Entity('files', { schema: 'superstar_log' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
@Unique('byKey', [ 'key' ])
@Unique('byGuid', [ 'guid' ])
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

  @Column('int', {
    unsigned: true,
    nullable: true, // null means system
  })
  userId: number;

  @ManyToOne(() => User, (users) => users.files, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;


  @OneToOne(
    () => GameArchivedAsset,
    gameAsset => gameAsset.file
  )
  gameAsset: GameArchivedAsset;
}

export type FileAccessRestriction = 'public';
export type FileEngine = 'aws-s3';
