import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { OAuthClient } from './OAuthClient';

@Entity('oauth_codes', { schema: 'superstar_log' })
export class OAuthCode {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { length: 255, unique: true })
  accessToken: string;

  @Column('datetime')
  accessTokenExpiration: Date;

  @Column('varchar', { length: 255, nullable: true })
  redirectUri: string;

  @ManyToOne(() => OAuthClient, (client) => client.codes, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'clientId', referencedColumnName: 'id' }])
  client: OAuthClient;

  @ManyToOne(() => User, (users) => users.userCredentials, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @Column('varchar', {
    name: 'guid',
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;
}

