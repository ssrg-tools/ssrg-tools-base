import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { LeagueRanking } from "./LeagueRanking";
import { LogCredits } from "./LogCredits";
import { LogDiamonds } from "./LogDiamonds";
import { LogDiamondsAds } from "./LogDiamondsAds";
import { LogDrops } from "./LogDrops";
import { Songs } from "./Songs";
import { Themes } from "./Themes";

@Index("guid", ["guid"], { unique: true })
@Entity("superstar_games", { schema: "superstar_log" })
export class SuperstarGames {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", {
    name: "name",
    length: 255,
    default: () => "'SuperStar '",
  })
  name: string;

  @Column("varchar", { name: "comment", nullable: true, length: 255 })
  comment: string | null;

  @Column("longtext", { name: "meta", nullable: true })
  meta: string | null;

  @Column("varchar", {
    name: "guid",
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @OneToMany(() => LeagueRanking, (leagueRanking) => leagueRanking.game)
  leagueRankings: LeagueRanking[];

  @OneToMany(() => LogCredits, (logCredits) => logCredits.game)
  logCredits: LogCredits[];

  @OneToMany(() => LogDiamonds, (logDiamonds) => logDiamonds.game)
  logDiamonds: LogDiamonds[];

  @OneToMany(() => LogDiamondsAds, (logDiamondsAds) => logDiamondsAds.game)
  logDiamondsAds: LogDiamondsAds[];

  @OneToMany(() => LogDrops, (logDrops) => logDrops.game)
  logDrops: LogDrops[];

  @OneToMany(() => Songs, (songs) => songs.game)
  songs: Songs[];

  @OneToMany(() => Themes, (themes) => themes.game)
  themes: Themes[];
}
