import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { User } from './User';
import { OAuthClient } from './OAuthClient';

@Entity('oauth_tokens', { schema: 'superstar_log' })
export class OAuthToken {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { length: 255, unique: true })
  accessToken: string;

  @Column('datetime')
  accessTokenExpiration: Date;

  @Column('varchar', { length: 255 })
  refreshToken: string;

  @Column('datetime')
  refreshTokenExpiration: Date;

  @ManyToOne(() => OAuthClient, client => client.tokens, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'clientId', referencedColumnName: 'id' }])
  client: Relation<OAuthClient>;

  @ManyToOne(() => User, users => users.userCredentials, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: Relation<User>;

  @Column('varchar', {
    unique: true,
    length: 255,
  })
  guid: string;
}
