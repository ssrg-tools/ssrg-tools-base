import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SuperstarGames } from './SuperstarGame';
import { User } from './User';

@Index('guid', ['guid'], { unique: true })
@Index('date', ['date'], {})
@Index('FK_log_diamonds_ads_users', ['userId'], {})
@Index('FK_log_diamonds_ads_superstar_games', ['gameId'], {})
@Entity('log_diamonds_ads', { schema: 'superstar_log' })
export class LogDiamondsAds {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'amount', unsigned: true })
  amount: number;

  @Column('datetime', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('int', {
    name: 'user_id',
    unsigned: true,
    default: () => '\'20150115\'',
  })
  userId: number;

  @Column('int', { name: 'game_id', unsigned: true, default: () => '\'1\'' })
  gameId: number;

  @Column('varchar', {
    name: 'guid',
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @ManyToOne(
    () => SuperstarGames,
    (superstarGames) => superstarGames.logDiamondsAds,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ name: 'game_id', referencedColumnName: 'id' }])
  game: SuperstarGames;

  @ManyToOne(() => User, (users) => users.logDiamondsAds, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
