import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SqlBool } from '../types';
import { User } from './User';

@Entity('users_logins', { schema: 'superstar_log' })
export class UserLogin {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Index('byDate')
  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('tinyint', { width: 1 })
  successful: SqlBool;

  @Column('json', {
    nullable: true,
  })
  meta: any;

  @ManyToOne(() => User, users => users.logins, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ referencedColumnName: 'id' }])
  user: User;
}
