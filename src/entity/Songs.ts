import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SuperstarGames } from "./SuperstarGames";
import { SongClearsV2 } from "./SongClearsV2";

@Index("guid", ["guid"], { unique: true })
@Index("FK_songs_superstar_games", ["gameId"], {})
@Entity("songs", { schema: "superstar_log" })
export class Songs {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "album", length: 255 })
  album: string;

  @Column("varchar", {
    name: "length_display",
    nullable: true,
    comment: "length for display, e.g. 1:34",
    length: 255,
  })
  lengthDisplay: string | null;

  @Column("decimal", {
    name: "length_nominal",
    nullable: true,
    comment: "length in (fractions of) minutes",
    precision: 10,
    scale: 3,
  })
  lengthNominal: string | null;

  @Column("int", { name: "game_id", unsigned: true, default: () => "'1'" })
  gameId: number;

  @Column("varchar", {
    name: "guid",
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @ManyToOne(() => SuperstarGames, (superstarGames) => superstarGames.songs, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "game_id", referencedColumnName: "id" }])
  game: SuperstarGames;

  @OneToMany(() => SongClearsV2, (songClearsV2) => songClearsV2.song)
  songClearsVs: SongClearsV2[];
}
