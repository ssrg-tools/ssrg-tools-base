import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SuperstarGame } from './SuperstarGame';
import { ArtistMember } from './ArtistMember';
import { Song } from './Song';
import { Theme } from './Theme';

@Entity('artists', { schema: 'superstar_log' })
export class Artist {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', length: 255, unique: true })
  name: string;

  @Column('tinyint', { unsigned: true, nullable: true })
  cardCount: number;

  @Column('varchar', {
    name: 'guid',
    unique: true,
    length: 255,
  })
  guid: string;

  @Column('int', { unsigned: true })
  gameId: number;

  @ManyToOne(
    () => SuperstarGame,
    (superstarGames) => superstarGames.artists,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ referencedColumnName: 'id' }])
  game: SuperstarGame;

  @OneToMany(() => ArtistMember, member => member.artist)
  members: ArtistMember[];

  @OneToMany(() => Song, song => song.artist)
  songs: Song[];

  @OneToMany(() => Theme, theme => theme.artist)
  themes: Theme[];
}
