import { Entity, ManyToOne, JoinColumn, Index, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity('users_verifications', { schema: 'superstar_log' })
export class UserVerification {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { length: 100 })
  codeHash: string;

  @Index('byCreated')
  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Index('byCompleted')
  @Column('datetime', { nullable: true })
  completed: Date;

  @ManyToOne(() => User, (users) => users.verifications, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ referencedColumnName: 'id' }])
  user: User;
}
