import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { LogDrops } from "./LogDrops";
import { SongClearCards } from "./SongClearCards";
import { SuperstarGames } from "./SuperstarGames";

@Index("guid", ["guid"], { unique: true })
@Index("FK_themes_superstar_games", ["gameId"], {})
@Entity("themes", { schema: "superstar_log" })
export class Themes {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "album", length: 255 })
  album: string;

  @Column("int", { name: "game_id", unsigned: true, default: () => "'1'" })
  gameId: number;

  @Column("varchar", {
    name: "guid",
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @OneToMany(() => LogDrops, (logDrops) => logDrops.theme)
  logDrops: LogDrops[];

  @OneToMany(() => SongClearCards, (songClearCards) => songClearCards.theme)
  songClearCards: SongClearCards[];

  @ManyToOne(() => SuperstarGames, (superstarGames) => superstarGames.themes, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "game_id", referencedColumnName: "id" }])
  game: SuperstarGames;
}
