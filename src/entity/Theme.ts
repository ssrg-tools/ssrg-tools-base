import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CardDrop } from './CardDrop';
import { SongClearCard } from './SongClearCard';
import { SuperstarGame } from './SuperstarGame';

@Index(['guid'], { unique: true })
@Index(['gameId'], {})
@Entity('themes', { schema: 'superstar_log' })
export class Theme {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('varchar', { name: 'album', length: 255 })
  album: string;

  @Column('int', { name: 'game_id', unsigned: true, default: 1 })
  gameId: number;

  @Column('varchar', {
    name: 'guid',
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @OneToMany(() => CardDrop, (logDrops) => logDrops.theme)
  logDrops: CardDrop[];

  @OneToMany(() => SongClearCard, (songClearCards) => songClearCards.theme)
  songClearCards: SongClearCard[];

  @ManyToOne(() => SuperstarGame, (superstarGames) => superstarGames.themes, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'game_id', referencedColumnName: 'id' }])
  game: SuperstarGame;
}
