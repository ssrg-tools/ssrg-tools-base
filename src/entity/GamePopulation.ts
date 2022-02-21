import { Index, Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { SuperstarGame } from './SuperstarGame';

@Entity('superstar_games_populations', { schema: 'superstar_log' })
export class GamePopulation {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { unsigned: true })
  population: number;

  @Index('byDate')
  @Column('datetime')
  date: Date;

  @Column('int', { unsigned: true })
  gameId: number;

  @Column('varchar', {
    unique: true,
    length: 255,
  })
  guid: string;

  @ManyToOne(() => SuperstarGame, superstarGames => superstarGames.populationHistory, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'gameId', referencedColumnName: 'id' }])
  game: Relation<SuperstarGame>;
}
