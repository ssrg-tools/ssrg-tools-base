import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Artist } from './Artist';

@Index(['artistId', 'name'], { unique: true })
@Index(['artistId', 'memberOffset'], { unique: true })
@Entity('artists_members', { schema: 'superstar_log' })
export class ArtistMember {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { unsigned: true })
  artistId: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('tinyint', { unsigned: true })
  memberOffset: number;

  @Index('byDateBirthday')
  @Column('datetime', { nullable: true })
  dateBirthday: Date;

  @Column('varchar', {
    name: 'guid',
    unique: true,
    length: 255,
  })
  guid: string;

  @ManyToOne(() => Artist, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn([{ name: 'artistId', referencedColumnName: 'id' }])
  artist: Artist;
}
