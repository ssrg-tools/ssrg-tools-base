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
@Index('FK_log_credits_users', ['userId'], {})
@Index('FK_log_credits_superstar_games', ['gameId'], {})
@Entity('log_credits', { schema: 'superstar_log' })
export class LogCredits {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'total_after', unsigned: true })
  totalAfter: number;

  @Column('int', { name: 'diff', nullable: true })
  diff: number | null;

  @Column('datetime', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('varchar', { name: 'event_type', length: 255 })
  eventType: string;

  @Column('varchar', { name: 'comment', nullable: true, length: 255 })
  comment: string | null;

  @Column('longtext', { name: 'meta', nullable: true })
  meta: string | null;

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
    (superstarGames) => superstarGames.logCredits,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ name: 'game_id', referencedColumnName: 'id' }])
  game: SuperstarGames;

  @ManyToOne(() => User, (users) => users.logCredits, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
