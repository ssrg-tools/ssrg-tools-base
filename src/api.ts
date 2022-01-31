import { Moment } from 'moment';
import { URLs } from './definitions/data/gameinfo';
import { SongClear } from './entity/SongClear';
import { SongClearCard } from './entity/SongClearCard';
import { SongWorldRecord } from './entity/SongWorldRecord';
import { DropSources, GradeNonEmpty, NumberLike, SqlBool } from './types';

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

  constructor([data, total]: [T[], number], pageSize: NumberLike, page: number | string = 0) {
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
    grade: GradeNonEmpty | '30%' | '100%';
    member?: string;
    memberOffset?: number;
    themeGuid: string;
    isPrism: SqlBool;
  }[];
}

export interface GameAssetsListingResult {
  sourceUrl: string;
  guid: string;
  file: {
    fingerprint: string;
    size: number;
    mime: string;
    meta: {
      detectMagic: string;
      detectMime: string;
      detectMagicReverse: string;
      detectBinwalk: string;
    };
    guid: string;
  };
  gamedataFileLinks: {
    bundleVersion: number;
    resourceVersion: number;
    originalCode: number;
    /** date string */
    dateArchival: Date;
    /** date string */
    sourceDateModified: Date;
    game: {
      key: string;
    };
  }[];
  uri: string;
}

export type ArchiveAssetResult = ArchiveAssetResultOk | ArchiveAssetResultError;
export interface ArchiveAssetResultOk {
  result: 'success' | 'exists';
  uri: string;
  fileEntity: {
    guid: string;
    fingerprint: string;
    size: number;
    key: string;
    mime: string;
  };
  archiveEntity: {
    guid: string;
    game: { key: string };
  };
}

export interface ArchiveAssetResultError {
  result: 'error';
}

export interface ResolvedUrl extends URLs {
  originalUrl: string;
  sourceDateModified: string;
  mime: string;
}

export type ResolvedUrls = ResolvedUrl[];
