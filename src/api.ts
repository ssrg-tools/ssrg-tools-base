import { NumberLike, DropSources, GradeNonEmpty, SqlBool } from './types';
import { SongWorldRecord } from './entity/SongWorldRecord';
import { SongClear } from './entity/SongClear';
import { SongClearCard } from './entity/SongClearCard';
import { Moment } from 'moment';

export interface BaseApiResponse<T> {
  data: T;

  timeTakenMs: number;
}

export class PaginationResult<T> implements BaseApiResponse<T[]> {
  data: T[];
  total: number;
  page: number | string;
  pageSize: number;

  timeTakenMs: number;

  constructor([data, total]: [T[], number], pageSize: NumberLike, page: number | string = 0)
  {
    this.data = data;
    this.total = total;
    this.page = page;
    this.pageSize = typeof pageSize === 'number' ? pageSize : parseInt(pageSize, 10);
  }
}

export interface ErrorResponse {
  type: 'error';
  reason: string;
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
  artistsCount: number;
  artistsMembersCount: number;
  topPlayerCount: number;
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
  themeGuid?: string;
}

export interface MomentDate {
  dateMoment: Moment;
}

export interface PostCardDropData {
  type: string;
  source: typeof DropSources.type;
  comment?: string;
  date: string | Date;
  cards: {
    grade: GradeNonEmpty | '30%' | '100%',
    member?: string,
    memberOffset?: number,
    themeGuid: string,
    isPrism: SqlBool,
  }[];
}

export interface GameAssetsListingResult {
  gameAssetVersion: number;
  gameSubAssetVersion: number;
  originalCode: number;
  /** date string */
  dateArchival: Date;
  sourceUrl: string;
  /** date string */
  sourceDateModified: Date;
  guid: string;
  file: {
    fingerprint: string,
    size: number,
    mime: string,
    meta: {
      detectMagic: string,
      detectMime: string,
      detectMagicReverse: string,
      detectBinwalk: string;
    };
    guid: string;
  };
  uri: string;
}
