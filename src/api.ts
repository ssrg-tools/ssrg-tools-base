import { NumberLike, DropSources, GradeNonEmpty, SqlBool } from './types';
import { SongWorldRecord } from './entity/SongWorldRecord';
import { SongClear } from './entity/SongClear';
import { SongClearCard } from './entity/SongClearCard';

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

export interface PostSongClear {
  songClear: {
    songGuid: string;
    divisionGuid: string;
  } & SongClear;
  songClearCards: (SongClearCard & CardExtra)[];
  totalAfter?: number;
}

export interface CardExtra {
  memberIndex: number;
  themeGuid?: string;
}

export interface PostCardDropData {
  type: string;
  source: typeof DropSources.type;
  comment?: string;
  date: string | Date;
  cards: {
    grade: GradeNonEmpty | '30%' | '100%',
    member: string | null,
    themeGuid: string,
    isPrism: SqlBool,
  }[];
}
