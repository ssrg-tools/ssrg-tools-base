import { StringUnion } from '@anhnyan/libanh';
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
import { SqlBool } from '..';

export const taskResultStatus = StringUnion('finished', 'incomplete', 'error', 'queued', 'stalled');
export type TaskResultStatus = typeof taskResultStatus.type;

export const taskResultTypes = StringUnion(
  'game-task',
  'import-season',
  'import-songs',
  'import-wr',
  'import-artists',
  'archive-assets',
  'upload-game-info',
  'generate-beatmap-chart',
);
export type TaskResultType = typeof taskResultTypes.type;

export const gameTaskResultType = StringUnion(
  'import-season',
  'import-songs',
  'import-wr',
  'import-artists',
  'archive-assets',
  'upload-game-info',
  'generate-beatmap-chart',
);
export type GameTaskResultType = typeof gameTaskResultType.type;

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

  @Column('tinyint', {
    default: 0,
    comment: 'whether this task result is inconsequential (e.g. a task that was skipped, or produced no output)',
  })
  markIgnored: SqlBool;
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

@ChildEntity('import-songs')
export class ImportSongTaskResult extends GameTaskResult {}

@ChildEntity('import-wr')
export class ImportWRTaskResult extends GameTaskResult {}

@ChildEntity('import-artists')
export class ImportArtistsTaskResult extends GameTaskResult {}

@ChildEntity('archive-assets')
export class ArchiveAssetsTaskResult extends GameTaskResult {}

@ChildEntity('upload-game-info')
export class UploadGameInfoTaskResult extends GameTaskResult {}

@ChildEntity('generate-beatmap-chart')
export class GenerateBeatmapChartTaskResult extends GameTaskResult {}
