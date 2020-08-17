import 'jasmine';
import { calcBaseRP } from './rp';
import { difficultyToEnum, DifficultyName } from './types';

const testData: {
  rpBase: number;
  rpTotal: number;
  rpBonus: number;
  scoreTotal: number;
  difficulty: DifficultyName;
  divisionId: number;
  divisionBonus: number;
}[] = [
  {
    rpBase: 488,
    rpTotal: 1122,
    rpBonus: 146,
    scoreTotal: 2136318,
    difficulty: 'Hard',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 2413,
    rpTotal: 3549,
    rpBonus: 723,
    scoreTotal: 2357322,
    difficulty: 'Normal',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 267,
    rpTotal: 614,
    rpBonus: 80,
    scoreTotal: 174990,
    difficulty: 'Normal',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 267,
    rpTotal: 614,
    rpBonus: 80,
    scoreTotal: 166031,
    difficulty: 'Normal',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 267,
    rpTotal: 614,
    rpBonus: 80,
    scoreTotal: 169631,
    difficulty: 'Normal',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 267,
    rpTotal: 614,
    rpBonus: 80,
    scoreTotal: 174034,
    difficulty: 'Normal',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 279,
    rpTotal: 641,
    rpBonus: 83,
    scoreTotal: 351269,
    difficulty: 'Normal',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 2944,
    rpTotal: 4271,
    rpBonus: 883,
    scoreTotal: 2826591,
    difficulty: 'Normal',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 550,
    rpTotal: 1265,
    rpBonus: 165,
    scoreTotal: 3069288,
    difficulty: 'Hard',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 553,
    rpTotal: 1271,
    rpBonus: 165,
    scoreTotal: 3105277,
    difficulty: 'Hard',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 291,
    rpTotal: 669,
    rpBonus: 87,
    scoreTotal: 530098,
    difficulty: 'Normal',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 376,
    rpTotal: 864,
    rpBonus: 112,
    scoreTotal: 1807351,
    difficulty: 'Normal',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 456,
    rpTotal: 1048,
    rpBonus: 136,
    scoreTotal: 3012920,
    difficulty: 'Normal',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 3486,
    rpTotal: 5017,
    rpBonus: 1045,
    scoreTotal: 3460564,
    difficulty: 'Normal',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 2486,
    rpTotal: 3717,
    rpBonus: 745,
    scoreTotal: 3462560,
    difficulty: 'Normal',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 3304,
    rpTotal: 4599,
    rpBonus: 991,
    scoreTotal: 730021,
    difficulty: 'Normal',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 2466,
    rpTotal: 3671,
    rpBonus: 739,
    scoreTotal: 3159553,
    difficulty: 'Normal',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 556,
    rpTotal: 1278,
    rpBonus: 166,
    scoreTotal: 3160850,
    difficulty: 'Hard',
    divisionId: 4,
    divisionBonus: 0.3
  },
  {
    rpBase: 561,
    rpTotal: 1290,
    rpBonus: 168,
    scoreTotal: 3233094,
    difficulty: 'Hard',
    divisionId: 4,
    divisionBonus: 0.3
  }
];

describe('Base RP calculator basic test', () => {
  testData.forEach((test) => {
    describe('Calculating base rp for ${test.scoreTotal}', () => {
      expect(calcBaseRP(test.scoreTotal, difficultyToEnum(test.difficulty))).toBe(test.rpBase-1);
    });
  });
});
