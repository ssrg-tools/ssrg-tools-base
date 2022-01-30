import { PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Index, OneToMany, Entity } from 'typeorm';
import { SuperstarGame } from './SuperstarGame';
import { SongWorldRecord } from './SongWorldRecord';

@Entity('world_record_seasons', { schema: 'superstar_log' })
export class WorldRecordSeason {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Index('byDateStart')
  @Column('datetime')
  dateStart: Date;

  @Index('byDateEnd')
  @Column('datetime')
  dateEnd: Date;

  @ManyToOne(() => SuperstarGame, superstarGames => superstarGames.songs, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'gameId', referencedColumnName: 'id' }])
  game: SuperstarGame;

  @Column('varchar', { length: 255, default: 'top100-no-tie' })
  bonusSystem: 'top1-tie' | 'top100-no-tie' | 'top100-tie';

  @Column('varchar', { name: 'comment', nullable: true, length: 255 })
  comment: string | null;

  @Column('longtext', { name: 'meta', nullable: true })
  meta: string | null;

  @Column('int', { nullable: true, unsigned: true })
  dalcomSeasonId: number | null;

  @Column('int', { unsigned: true })
  gameId: number;

  @Column('varchar', {
    unique: true,
    length: 255,
  })
  guid: string;

  @OneToMany(() => SongWorldRecord, songs => songs.season)
  entries: SongWorldRecord[];
}
