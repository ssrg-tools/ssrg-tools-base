import { Index, Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { SuperstarGame } from './SuperstarGame';
import { GameManifest as GameManifestType } from '../definitions/data/gamemanifest';

@Unique('perGameAndVersion', [ 'gameId', 'versionString' ])
@Entity('zz_gamedata_manifests', { schema: 'superstar_log' })
export class GameManifest {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('int', { unsigned: true })
  gameId: number;

  @Column('varchar')
  versionString: string;

  @Column('int')
  versionNumber: number;

  @Column('json')
  data: GameManifestType;

  @Index('byDate')
  @Column('datetime')
  date: Date;

  @Column('varchar', {
    unique: true,
    length: 255,
  })
  guid: string | null;

  @ManyToOne(
    () => SuperstarGame,
    (superstarGames) => superstarGames.gameManifests,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ name: 'gameId', referencedColumnName: 'id' }])
  game: SuperstarGame;

  versionKeyAsNumber() {
    const parts = this.versionParts();
    return parts[0] * 10000 + parts[1] * 100 + parts[2];
  }

  versionParts() {
    return this.versionString.split('.').map(x => parseInt(x, 10));
  }
}

