import { Difficulty, GradeNonEmpty } from './types';

export function calcBaseRP(scoreTotal: number, difficulty: Difficulty) {
  let base: number;

  switch (difficulty) {
    case Difficulty.Easy:
      base = 201;
      break;
    case Difficulty.Normal:
      base = 255;
      break;
    case Difficulty.Hard:
      base = 345;
      break;
  }

  const rp = scoreTotal / 15000.0;

  return Math.ceil(base + rp);
}

export const upgradeCost: { [gradeStart: string]: number } = {
  C: 2500,
  B: 5000,
  A: 10000,
  S: 20000,
};
