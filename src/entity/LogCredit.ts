import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { SuperstarGame } from './SuperstarGame';
import { User } from './User';

@Entity('log_credits', { schema: 'superstar_log' })
export class LogCredit {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'total_after', unsigned: true })
  totalAfter: number;

  @Column('int', { name: 'diff', nullable: true })
  diff: number | null;

  @Index('byDate')
  @Column('datetime', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Index('byType')
  @Column('varchar', { name: 'event_type', length: 255 })
  eventType: string;

  @Column('varchar', { name: 'comment', nullable: true, length: 255 })
  comment: string | null;

  @Column('longtext', { name: 'meta', nullable: true })
  meta: string | null;

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

  @ManyToOne(() => SuperstarGame, superstarGames => superstarGames.logCredits, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'game_id', referencedColumnName: 'id' }])
  game: Relation<SuperstarGame>;

  @ManyToOne(() => User, users => users.logCredits, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Relation<User>;
}
