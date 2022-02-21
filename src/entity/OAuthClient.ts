import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from 'typeorm';
import { OAuthCode } from './OAuthCode';
import { OAuthToken } from './OAuthToken';

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
    unique: true,
    length: 255,
  })
  guid: string;

  @OneToMany(() => OAuthCode, code => code.client)
  codes: Relation<OAuthCode>[];

  @OneToMany(() => OAuthToken, token => token.client)
  tokens: Relation<OAuthToken>[];
}
