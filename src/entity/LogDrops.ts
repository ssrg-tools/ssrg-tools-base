import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SuperstarGames } from "./SuperstarGames";
import { Themes } from "./Themes";
import { Users } from "./Users";

@Index("guid", ["guid"], { unique: true })
@Index("FK_log_drops_themes", ["themeId"], {})
@Index("FK_log_drops_users", ["userId"], {})
@Index("FK_log_drops_superstar_games", ["gameId"], {})
@Entity("log_drops", { schema: "superstar_log" })
export class LogDrops {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("enum", {
    name: "source",
    enum: [
      "Purchase (Diamonds)",
      "Purchase (RP)",
      "Purchase ($$$)",
      "Reward",
      "Challenge",
      "Clear",
    ],
  })
  source:
    | "Purchase (Diamonds)"
    | "Purchase (RP)"
    | "Purchase ($$$)"
    | "Reward"
    | "Challenge"
    | "Clear";

  @Column("varchar", { name: "type", nullable: true, length: 255 })
  type: string | null;

  @Column("enum", {
    name: "member",
    enum: ["Sowon", "Yerin", "Eunha", "Yuju", "SinB", "Umji", "Power Up"],
  })
  member: "Sowon" | "Yerin" | "Eunha" | "Yuju" | "SinB" | "Umji" | "Power Up";

  @Column("int", { name: "theme_id", nullable: true, unsigned: true })
  themeId: number | null;

  @Column("enum", {
    name: "grade",
    enum: ["C", "B", "A", "S", "R", "30%", "100%"],
  })
  grade: "C" | "B" | "A" | "S" | "R" | "30%" | "100%";

  @Column("datetime", { name: "date", default: () => "CURRENT_TIMESTAMP" })
  date: Date;

  @Column("tinyint", { name: "is_prism", unsigned: true, default: () => "'0'" })
  isPrism: number;

  @Column("text", { name: "comment", nullable: true })
  comment: string | null;

  @Column("int", {
    name: "user_id",
    unsigned: true,
    default: () => "'20150115'",
  })
  userId: number;

  @Column("int", { name: "game_id", unsigned: true, default: () => "'1'" })
  gameId: number;

  @Column("varchar", {
    name: "guid",
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @ManyToOne(
    () => SuperstarGames,
    (superstarGames) => superstarGames.logDrops,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "game_id", referencedColumnName: "id" }])
  game: SuperstarGames;

  @ManyToOne(() => Themes, (themes) => themes.logDrops, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "theme_id", referencedColumnName: "id" }])
  theme: Themes;

  @ManyToOne(() => Users, (users) => users.logDrops, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
