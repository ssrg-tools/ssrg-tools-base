import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';
import { ArtistMember } from './ArtistMember';
import { Song } from './Song';
import { SuperstarGame } from './SuperstarGame';
import { Theme } from './Theme';

@Entity('artists', { schema: 'superstar_log' })
@Unique('artistName', ['name', 'gameId'])
export class Artist {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('tinyint', { unsigned: true, nullable: true })
  cardCount: number;

  /** arbitrary sort, possibly unused */
  @Column('int', { nullable: true })
  sort: number;

  @Column('varchar', {
    length: 255,
    nullable: true,
    default: null,
  })
  imageId: string | null;

  @Column('varchar', {
    length: 255,
    nullable: true,
    default: null,
  })
  imageUrl: string | null;

  @Index('byDateDebut')
  @Column('datetime', { nullable: true })
  dateDebut: Date;

  @Column('varchar', {
    length: 255,
    nullable: true,
    comment: 'to group e.g. the NCT units under NCT',
  })
  group: string;

  @Column('json', { default: '{}', select: false })
  meta: Record<string, unknown>;

  @Index('byCode')
  @Column('simple-json', {
    comment: 'game internal artist ids',
    nullable: true,
    default: [],
  })
  internalIds: number[];

  @Column('varchar', {
    name: 'guid',
    unique: true,
    length: 255,
  })
  guid: string;

  @Column('int', { unsigned: true })
  gameId: number;

  @ManyToOne(() => SuperstarGame, superstarGames => superstarGames.artists, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ referencedColumnName: 'id' }])
  game: Relation<SuperstarGame>;

  @OneToMany(() => ArtistMember, member => member.artist)
  members: Relation<ArtistMember>[];

  @OneToMany(() => Song, song => song.artist)
  songs: Relation<Song>[];

  @OneToMany(() => Theme, theme => theme.artist)
  themes: Relation<Theme>[];
}
