import {
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  TableInheritance,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tasks_results', { schema: 'ssrg_tools_logs' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
@Unique('byGuid', ['guid'])
@Index('byType', ['type', 'status'])
export abstract class BaseTaskResult {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Index('byDateCreated')
  @CreateDateColumn()
  created: Date;

  @Index('byDateUpdated')
  @UpdateDateColumn()
  updated: Date;

  @Index('byDateFinished')
  @Column('datetime', { nullable: true })
  finished: Date | null;

  @Column('varchar', { length: 255, default: 'incomplete' })
  status: string;

  @Column('varchar', { length: 255 })
  guid: string;

  @Column('varchar', { length: 255 })
  type: string;

  @Column('longtext', { nullable: true })
  log: string | null;
}

@ChildEntity('game-task')
export class GameTaskResult extends BaseTaskResult {
  @Index()
  @Column('varchar', { length: 255, nullable: true })
  gameGuid: string;

  // This lives in another connection
  // @ManyToOne(() => SuperstarGame, undefined, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'gameGuid', referencedColumnName: 'guid' })
  // game: SuperstarGame;
}

@ChildEntity('import-season')
export class ImportSeasonTaskResult extends GameTaskResult {}
