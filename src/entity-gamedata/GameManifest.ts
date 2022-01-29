import { Index, Entity, PrimaryGeneratedColumn, Column, Unique, BeforeInsert } from 'typeorm';
import { GameManifestData as GameManifestType } from '../definitions/data/gamemanifest';

@Unique('perGameAndVersion', ['gameGuid', 'versionString'])
@Entity('assets_manifests')
export class GameManifest {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: bigint;

  @Column('varchar', {
    length: 50,
  })
  gameGuid: string;

  @Column('varchar', {
    length: 50,
  })
  versionString: string;

  @Column('int', { unsigned: true })
  versionNumber: number;

  @Column('json')
  data: GameManifestType;

  @Index('byDate')
  @Column('datetime')
  date: Date;

  @Column('varchar', {
    unique: true,
    length: 50,
  })
  guid: string;

  versionKeyAsNumber() {
    const parts = this.versionParts();
    return parts[0] * 10000 + parts[1] * 100 + parts[2];
  }

  versionParts() {
    return this.versionString.split('.').map(x => parseInt(x, 10));
  }

  @BeforeInsert()
  updateVersionNumber() {
    this.versionNumber = this.versionKeyAsNumber();
  }
}
