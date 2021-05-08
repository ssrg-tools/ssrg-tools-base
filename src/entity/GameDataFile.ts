import { Index, Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Unique, OneToMany } from 'typeorm';
import { GameArchivedAssetLink } from './Archive/GameArchivedAssetLink';
import { SuperstarGame } from './SuperstarGame';

export const fingerprintAlgo = 'sha256';

@Unique('perGameAndVersionAndKey', [ 'gameId', 'version', 'key' ])
@Entity('zz_gamedata_files', { schema: 'superstar_log' })
export class GameDataFile<T = any> {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('int', { unsigned: true })
  gameId: number;

  @Column('int', { unsigned: true })
  version: number;

  @Column('varchar', { length: 255 })
  key: string;

  @Column('json')
  data: T;

  @Index('byDate')
  @Column('datetime')
  date: Date;

  @Column('varchar', {
    unique: true,
    length: 255,
  })
  guid: string | null;

  @Column('varchar', { length: 255 })
  fingerprint: string;

  @ManyToOne(
    () => SuperstarGame,
    (superstarGames) => superstarGames.gameDataFiles,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ name: 'gameId', referencedColumnName: 'id' }])
  game: SuperstarGame;

  @OneToMany(() => GameArchivedAssetLink, (assetLink) => assetLink.gamedataFile)
  assetLinks: GameArchivedAssetLink[];

  getData(): T {
    return this.data;
  }

  castTo<R>(): R {
    return this.data as unknown as R;
  }
}

