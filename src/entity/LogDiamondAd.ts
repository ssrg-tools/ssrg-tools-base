import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { SuperstarGame } from './SuperstarGame';
import { User } from './User';

@Entity('log_diamonds_ads', { schema: 'superstar_log' })
export class LogDiamondAd {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Index('byAmount')
  @Column('int', { name: 'amount', unsigned: true })
  amount: number;

  @Index('byDate')
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
    unique: true,
    length: 255,
  })
  guid: string;

  @ManyToOne(() => SuperstarGame, superstarGames => superstarGames.logDiamondsAds, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'game_id', referencedColumnName: 'id' }])
  game: Relation<SuperstarGame>;

  @ManyToOne(() => User, users => users.logDiamondsAds, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Relation<User>;
}
