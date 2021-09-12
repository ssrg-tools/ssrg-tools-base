import 'jasmine';
import { calcBaseRP } from './rp';
import { difficultyToEnum, DifficultyName } from './types';

const testData: {
  rpBase: number;
  rpTotal: number;
  rpBonus: number;
  scoreTotal: number;
  difficulty: DifficultyName;
  isChallenge: boolean;
  divisionId: number;
  divisionBonus: number;
}[] = [
  {
    rpBase: 488,
    rpTotal: 1122,
    rpBonus: 146,
    scoreTotal: 2136318,
    difficulty: 'Hard',
    isChallenge: false,
    divisionId: 4,
    divisionBonus: 0.3,
  },
  {
    rpBase: 267,
    rpTotal: 614,
    rpBonus: 80,
    scoreTotal: 174990,
    difficulty: 'Normal',
    isChallenge: false,
    divisionId: 4,
    divisionBonus: 0.3,
  },
  {
    rpBase: 267,
    rpTotal: 614,
    rpBonus: 80,
    scoreTotal: 166031,
    difficulty: 'Normal',
    isChallenge: false,
    divisionId: 4,
    divisionBonus: 0.3,
  },
  {
    rpBase: 267,
    rpTotal: 614,
    rpBonus: 80,
    scoreTotal: 169631,
    difficulty: 'Normal',
    isChallenge: false,
    divisionId: 4,
    divisionBonus: 0.3,
  },
  {
    rpBase: 267,
    rpTotal: 614,
    rpBonus: 80,
    scoreTotal: 174034,
    difficulty: 'Normal',
    isChallenge: false,
    divisionId: 4,
    divisionBonus: 0.3,
  },
  {
    rpBase: 279,
    rpTotal: 641,
    rpBonus: 83,
    scoreTotal: 351269,
    difficulty: 'Normal',
    isChallenge: false,
    divisionId: 4,
    divisionBonus: 0.3,
  },
  {
    rpBase: 550,
    rpTotal: 1265,
    rpBonus: 165,
    scoreTotal: 3069288,
    difficulty: 'Hard',
    isChallenge: false,
    divisionId: 4,
    divisionBonus: 0.3,
  },
  {
    rpBase: 553,
    rpTotal: 1271,
    rpBonus: 165,
    scoreTotal: 3105277,
    difficulty: 'Hard',
    isChallenge: false,
    divisionId: 4,
    divisionBonus: 0.3,
  },
  {
    rpBase: 291,
    rpTotal: 669,
    rpBonus: 87,
    scoreTotal: 530098,
    difficulty: 'Normal',
    isChallenge: false,
    divisionId: 4,
    divisionBonus: 0.3,
  },
  {
    rpBase: 376,
    rpTotal: 864,
    rpBonus: 112,
    scoreTotal: 1807351,
    difficulty: 'Normal',
    isChallenge: false,
    divisionId: 4,
    divisionBonus: 0.3,
  },
  {
    rpBase: 456,
    rpTotal: 1048,
    rpBonus: 136,
    scoreTotal: 3012920,
    difficulty: 'Normal',
    isChallenge: false,
    divisionId: 4,
    divisionBonus: 0.3,
  },
  {
    rpBase: 556,
    rpTotal: 1278,
    rpBonus: 166,
    scoreTotal: 3160850,
    difficulty: 'Hard',
    isChallenge: false,
    divisionId: 4,
    divisionBonus: 0.3,
  },
  {
    rpBase: 561,
    rpTotal: 1290,
    rpBonus: 168,
    scoreTotal: 3233094,
    difficulty: 'Hard',
    isChallenge: false,
    divisionId: 4,
    divisionBonus: 0.3,
  },
  // { //  this is with penalty
  //   rpBase: 176,
  //   rpBonus: 123,
  //   rpTotal: 475,
  //   scoreTotal: 21749,
  //   difficulty: 'Easy',
  //   isChallenge: false,
  //   divisionId: 123,
  //   divisionBonus: 0.7,
  // },
  {
    rpBase: 333,
    rpBonus: 99,
    rpTotal: 765,
    scoreTotal: 1975582,
    difficulty: 'Easy',
    isChallenge: false,
    divisionId: 4,
    divisionBonus: 0.3,
  },
];

describe('Base RP calculator basic test', () => {
  testData.forEach((test) => {
    it(`calculates base rp for ${test.scoreTotal}`, () => {
      expect(
        calcBaseRP(test.scoreTotal, difficultyToEnum(test.difficulty)),
      ).toBe(test.rpBase);
    });
  });
});
