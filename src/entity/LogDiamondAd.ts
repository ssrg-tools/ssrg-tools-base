import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SuperstarGame } from './SuperstarGame';
import { User } from './User';

@Index(['guid'], { unique: true })
@Index(['date'], {})
@Index(['userId'], {})
@Index(['gameId'], {})
@Entity('log_diamonds_ads', { schema: 'superstar_log' })
export class LogDiamondAd {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'amount', unsigned: true })
  amount: number;

  @Column('datetime', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('int', {
    name: 'user_id',
    unsigned: true,
    default: 20150115,
  })
  userId: number;

  @Column('int', { name: 'game_id', unsigned: true, default: 1 })
  gameId: number;

  @Column('varchar', {
    name: 'guid',
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @ManyToOne(
    () => SuperstarGame,
    (superstarGames) => superstarGames.logDiamondsAds,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ name: 'game_id', referencedColumnName: 'id' }])
  game: SuperstarGame;

  @ManyToOne(() => User, (users) => users.logDiamondsAds, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
