import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { CardDrop } from './CardDrop';
import { SongClearCard } from './SongClearCard';
import { SuperstarGame } from './SuperstarGame';
import { Artist } from './Artist';

@Entity('themes', { schema: 'superstar_log' })
export class Theme {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('varchar', { name: 'album', length: 255 })
  album: string;

  @Column('simple-array', {
    comment: 'contains theme tags like "Limited", "Event", "Original"',
  })
  tags: string[];

  @Column('int', {
    unsigned: true,
    default: 0,
    comment: 'ID of the frame cards, for LE/Event cards',
  })
  frameId: number;

  @Column('int', {
    unsigned: true,
    default: 1,
    comment: 'ID of the prism bg, GFriend prism cards',
  })
  prismId: number;

  @Column('int', { unsigned: true, nullable: true })
  cardIdStart: number;

  @Column('int', { unsigned: true, nullable: true })
  prismCardIdStart: number;

  @Column('int', { unsigned: true, nullable: true })
  cardCount: number;

  @Index('byDateReleased')
  @Column('datetime', { nullable: true })
  dateReleased: Date;

  @Column('int', { name: 'game_id', unsigned: true, default: 1 })
  gameId: number;

  @Column('int', { name: 'artist_id', unsigned: true })
  artistId: number;

  @Column('json', { default: '{}', select: false })
  meta: any;

  @Index('byCode')
  @Column('int', {
    comment: 'game internal theme id',
    nullable: true,
    default: null,
  })
  internalId: number;

  @Column('varchar', {
    name: 'guid',
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @ManyToOne(() => Artist, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn([{ name: 'artist_id', referencedColumnName: 'id' }])
  artist: Artist;

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
