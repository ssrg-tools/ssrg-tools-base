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
import { StringUnion } from '../string-union';

export const taskResultStatus = StringUnion('finished', 'incomplete', 'error');
export type TaskResultStatus = typeof taskResultStatus.type;

@Entity('tasks_results', { schema: 'ssrg_tools_logs' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
@Unique('byGuid', ['guid'])
@Index('byType', ['type', 'status'])
export abstract class BaseTaskResult {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Index('byDateCreated')
  @CreateDateColumn({ comment: 'time of record in database' })
  created: Date;

  @Index('byDateStarted')
  @Column('datetime', {
    comment: 'time of task start (defaults to creation)',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  started: Date;

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

  @Column('varchar', { length: 255, nullable: true, comment: 'user who triggered this task' })
  userGuid: string | null;

  @Column('json', { default: '{}', comment: 'task specific (output) data' })
  result: Record<string, unknown> | null;

  @Column('json', { default: '{}' })
  meta: Record<string, unknown>;
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

@ChildEntity('import-wr')
export class ImportWRTaskResult extends GameTaskResult {}

@ChildEntity('import-artists')
export class ImportArtistsTaskResult extends GameTaskResult {}

@ChildEntity('archive-assets')
export class ArchiveAssetsTaskResult extends GameTaskResult {}

@ChildEntity('generate-beatmap-chart')
export class GenerateBeatmapChartTaskResult extends GameTaskResult {}
