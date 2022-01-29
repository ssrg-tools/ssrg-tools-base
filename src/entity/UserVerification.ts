import { StringUnion } from '../string-union';
import { Entity, ManyToOne, JoinColumn, Index, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import moment from 'moment';

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
  completed?: Date;

  @Column('varchar', { length: 50 })
  intent: VerificationIntents;

  @Column({ nullable: true })
  expire?: Date;

  @ManyToOne(() => User, users => users.verifications, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ referencedColumnName: 'id' }])
  user: User;
}

export const VerificationIntents = StringUnion('2fa', 'verify-account', 'pw-reset');
export type VerificationIntents = typeof VerificationIntents.type;

export const verificationExpireOffsets: Record<VerificationIntents, moment.DurationInputArg1> = {
  '2fa': { minutes: 10 },
  'verify-account': { days: 1 },
  'pw-reset': { days: 7 },
};
