import { Entity, PrimaryGeneratedColumn, Index, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PlayerProfile } from './PlayerProfile';

@Entity('player_profile_nicknames', { schema: 'superstar_log' })
export class PlayerNickname {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Index('byNickname')
  @Column('varchar', {
    length: 255,
  })
  nickname: string;

  @Column('int', { unsigned: true })
  profileId: number;

  @Index('byDate')
  @Column('datetime', { nullable: true, select: false })
  date: Date;

  @Column('varchar', {
    unique: true,
    length: 255,
  })
  guid: string;

  @ManyToOne(() => PlayerProfile, player => player.nicknameHistory, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'profileId', referencedColumnName: 'id' }])
  profile: PlayerProfile;
}
