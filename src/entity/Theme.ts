import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CardDrop, SongClearCard, SuperstarGame } from './internal';

@Entity('themes', { schema: 'superstar_log' })
export class Theme {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('varchar', { name: 'album', length: 255 })
  album: string;

  @Column('simple-array', { comment: 'contains theme tags like "Limited", "Event", "Original"' })
  tags: string[];

  @Column('int', { unsigned: true, default: 0, comment: 'ID of the frame cards, for LE/Event cards' })
  frameId: number;

  @Column('int', { unsigned: true, default: 1, comment: 'ID of the prism bg, GFriend prism cards' })
  prismId: number;

  @Column('int', { unsigned: true, nullable: true })
  cardIdStart: number;

  @Column('int', { unsigned: true, nullable: true })
  cardCount: number;

  @Index('byDateReleased')
  @Column('datetime', { nullable: true })
  dateReleased: Date;

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
