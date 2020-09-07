import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OAuthCode, OAuthToken } from './internal';

@Entity('oauth_clients', { schema: 'superstar_log' })
export class OAuthClient {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { unique: true, length: 100 })
  clientId: string;

  @Column('varchar', { unique: true, length: 100 })
  clientSecret: string;

  @Column('simple-json')
  redirectUris: string[];

  @Column('simple-array')
  grants: string[];

  @Column('varchar', {
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @OneToMany(() => OAuthCode, (code) => code.client)
  codes: OAuthCode[];

  @OneToMany(() => OAuthToken, (token) => token.client)
  tokens: OAuthToken[];
}