import { Column, PrimaryColumn } from 'typeorm';

export abstract class Base {
  @PrimaryColumn({ unsigned: true })
  code: number;

  @PrimaryColumn({ length: 50 })
  gameGuid: string;

  @Column({ unsigned: true, comment: 'first version this entity appeared in' })
  versionFirst: number;

  @Column({ unsigned: true, comment: 'first version this entity appeared in' })
  versionLast: number;

  @Column({
    unsigned: true,
    comment: 'current version this entity appeared in',
  })
  versionSource: number;

  @Column()
  dateUpdated: Date;
}
