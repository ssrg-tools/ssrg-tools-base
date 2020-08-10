import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Index(['guid'], { unique: true })
@Index(['userId'], {})
@Entity('user_credentials', { schema: 'superstar_log' })
export class UserCredential {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id', unsigned: true })
  userId: number;

  @Column('varchar', { name: 'guid', unique: true, length: 255 })
  guid: string;

  @Column('varchar', { name: 'type', length: 255 })
  type: string;

  @Column('varchar', { name: 'subtype', nullable: true, length: 255 })
  subtype: string | null;

  @Column('varbinary', {
    name: 'keyId',
    comment:
      'contains either the secret itself, or the id of the secret (e.g. pub-key)',
    length: 255,
  })
  keyId: Buffer;

  @Column('blob', { name: 'keyData', nullable: true })
  keyData: Buffer | null;

  @Column('longtext', { name: 'metadata' })
  metadata: string;

  @Column('datetime', { name: 'created', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column('datetime', {
    name: 'updated',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated: Date | null;

  @ManyToOne(() => User, (users) => users.userCredentials, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
