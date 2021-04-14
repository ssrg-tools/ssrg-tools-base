import { Index, Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { CardDisplay } from './CardDisplay.embed';
import { PlayerProfile } from './PlayerProfile';

@Entity('player_profile_images', { schema: 'superstar_log' })
export class PlayerProfileImage {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { unsigned: true })
  profileId: number;

  @Column('int', { unsigned: true})
  profileImage: number;

  @Column(type => CardDisplay)
  leaderCard?: CardDisplay;

  @Index('byDate')
  @Column('datetime', { nullable: true, select: false })
  date: Date;

  @Column('varchar', {
    unique: true,
    length: 255,
  })
  guid: string | null;

  @ManyToOne(
    () => PlayerProfile,
    player => player.nicknameHistory,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ name: 'profileId', referencedColumnName: 'id' }])
  profile: PlayerProfile;
}
