import { SqlBool } from '../types';
import { Index, Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany, Relation } from 'typeorm';
import { SuperstarGame } from './SuperstarGame';
import { PlayerNickname } from './PlayerNickname';
import { PlayerProfileImage } from './PlayerProfileImage';

/**
 * In-game profiles to track common attributes
 */
@Index(['objectID', 'gameId'], { unique: true })
@Entity('player_profiles', { schema: 'superstar_log' })
export class PlayerProfile {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Index('byNickname')
  @Column('varchar', {
    length: 255,
    comment: 'the current nickname',
  })
  nickname: string;

  @Index('byObjectID')
  @Column('int', { unsigned: true, nullable: true })
  objectID: number;

  @Column('int', { unsigned: true, nullable: true, default: 0 })
  specialUserCode: number;

  @Column('tinyint', {
    unsigned: true,
    nullable: true,
    comment: 'in SSRGs the divisions are divided into two groups',
  })
  divisionGroup: number;

  @Index('bySSRGDiscord')
  @Column('tinyint', { unsigned: true, width: 1, default: 0 })
  isSSRGDiscord: SqlBool;

  @Index('byDateFirstObserved')
  @Column('datetime', { nullable: true })
  dateFirstObserved: Date;

  @Index('byDateReportedRegistration')
  @Column('datetime', { nullable: true })
  dateReportedRegistration: Date;

  @Column('int', { unsigned: true })
  gameId: number;

  @Column('varchar', {
    unique: true,
    length: 255,
  })
  guid: string;

  @Index('byDateRegistered')
  @Column('datetime', { nullable: true, select: false })
  dateRegistered: Date;

  @ManyToOne(() => SuperstarGame, superstarGames => superstarGames.playerProfiles, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'gameId', referencedColumnName: 'id' }])
  game: Relation<SuperstarGame>;

  @OneToMany(() => PlayerNickname, nickname => nickname.profile)
  nicknameHistory: Relation<PlayerNickname>[];

  @OneToMany(() => PlayerProfileImage, profileImage => profileImage.profile)
  profileImageHistory: Relation<PlayerProfileImage>[];
}

interface NicknameHistory {
  name: string;
  /** date observed */
  date: string;
}
