import { Index, Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

export const fingerprintAlgo = 'sha256';

@Unique('perGameAndVersionAndKey', ['gameGuid', 'version', 'key'])
@Entity('assets_files')
export class GamedataFile<T = any> {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: bigint;

  @Column('varchar', {
    length: 50,
  })
  gameGuid: string;

  @Column('int', { unsigned: true })
  version: number;

  @Column('varchar', { length: 50 })
  key: string;

  @Column('json')
  data: T;

  @Index('byDate')
  @Column('datetime')
  date: Date;

  @Column('varchar', {
    unique: true,
    length: 50,
  })
  guid: string;

  @Column('varchar', { length: 255 })
  fingerprint: string;

  getData(): T {
    return this.data;
  }

  castTo<R>(): R {
    return this.data as unknown as R;
  }
}
