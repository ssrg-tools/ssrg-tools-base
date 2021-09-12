/** Stuff to map from Dalcom game data */

import { GradeNonEmpty } from './types';

export type DateNumber = number;

// where is the None grade?
export const dalcomGradeMap: { [dalcomId: number]: GradeNonEmpty } = {
  0: 'C',
  1: 'B',
  2: 'A',
  3: 'S',
  4: 'R',
};

export interface WRRecord {
  /** dalcom internal song id */
  code: number;
  rankDataRaw: {
    type: number;
    /** unix timestamp with milli time */
    nextUpdate: DateNumber;
    ranking: WRRecordEntry[];
  };
}

export interface WRRecordEntry {
  /** no idea what this is supposed to be */
  objectID: number;
  specialUserCode: 0;
  nickname: string;
  /** profile image name, e.g. 13006 */
  profileImage: number;
  leaderCard?: LeaderCardShort;
  highscore: number;
  /** unix timestamp with milli time */
  updatedAt: DateNumber;
}

export interface LeaderCardShort {
  /** card image name, e.g. 1033 */
  c: number;
  /**
   * dalcom grade
   * @see dalcomGradeMap
   */
  g: number;
  /** card level */
  l: number;
}
