import { Entity, ManyToOne, JoinColumn, Index, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { SqlBool } from '../types';

@Entity('users_logins', { schema: 'superstar_log' })
export class UserLogin {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Index('byDate')
  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('tinyint', { width: 1 })
  successful: SqlBool;

  @ManyToOne(() => User, (users) => users.logins, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ referencedColumnName: 'id' }])
  user: User;
}
