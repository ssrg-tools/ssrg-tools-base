import { NumberLike } from './types';
import { SongWorldRecord } from './entity/SongWorldRecord';

export interface BaseApiResponse<T> {
  data: T;

  timeTakenMs: string;
}

export class PaginationResult<T> implements BaseApiResponse<T[]> {
  data: T[];
  total: number;
  page: number | string;
  pageSize: number;

  timeTakenMs: string;

  constructor([data, total]: [T[], number], pageSize: NumberLike, page: number | string = 0)
  {
    this.data = data;
    this.total = total;
    this.page = page;
    this.pageSize = typeof pageSize === 'number' ? pageSize : parseInt(pageSize, 10);
  }
}

export interface GameSummary {
  name: string;
  key: string;
  tagline: string;
  songsCount: number;
  themesCount: number;
  dropsCount: number;
  clearCount: number;
  beatmapsCount: number;
  worldRecords?: SongWorldRecord[];
}
