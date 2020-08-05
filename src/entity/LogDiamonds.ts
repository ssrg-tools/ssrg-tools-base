import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SuperstarGames } from "./SuperstarGames";
import { Users } from "./Users";

@Index("guid", ["guid"], { unique: true })
@Index("FK_log_diamonds_users", ["userId"], {})
@Index("FK_log_diamonds_superstar_games", ["gameId"], {})
@Entity("log_diamonds", { schema: "superstar_log" })
export class LogDiamonds {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "total_after", unsigned: true })
  totalAfter: number;

  @Column("int", { name: "diff", nullable: true })
  diff: number | null;

  @Column("datetime", { name: "date", default: () => "CURRENT_TIMESTAMP" })
  date: Date;

  @Column("varchar", { name: "event_type", length: 255 })
  eventType: string;

  @Column("varchar", { name: "comment", nullable: true, length: 255 })
  comment: string | null;

  @Column("longtext", { name: "meta", nullable: true })
  meta: string | null;

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
    (superstarGames) => superstarGames.logDiamonds,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "game_id", referencedColumnName: "id" }])
  game: SuperstarGames;

  @ManyToOne(() => Users, (users) => users.logDiamonds, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
