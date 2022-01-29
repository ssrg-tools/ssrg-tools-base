import { Card } from './types';
import { calculateIdealScore } from './score-calculator';
import 'jasmine';

const dummyTheme = { name: 'foo', album: 'bar' };
const testData: {
  cards: Card[];
  themeBonus: number;
  expectedScore: number;
}[] = [
  // {
  //   cards: [
  //     new Card('None'),
  //     new Card('None'),
  //     new Card('None'),
  //   ],
  //   themeBonus: 0,
  //   expectedScore: 60000,
  // },
  // {
  //   cards: [
  //     new Card('B', 1, false, '', dummyTheme),
  //     new Card('B', 1, false, '', dummyTheme),
  //     new Card('None'),
  //     new Card('None'),
  //     new Card('None'),
  //     new Card('None'),
  //   ],
  //   themeBonus: 5000,
  //   expectedScore: 300000,
  // },
  {
    cards: [new Card('R', 50)],
    themeBonus: 545000,
    expectedScore: 6403000,
  },
  {
    cards: [new Card('R', 50, true)],
    themeBonus: 545000,
    expectedScore: 6954000,
  },
  {
    // 6x R1
    cards: [
      new Card('R', 1, false, '', dummyTheme),
      new Card('R', 1, false, '', dummyTheme),
      new Card('R', 1, false, '', dummyTheme),
      new Card('R', 1, false, '', dummyTheme),
      new Card('R', 1, false, '', dummyTheme),
      new Card('R', 1, false, '', dummyTheme),
    ],
    themeBonus: 545000,
    expectedScore: 3561000,
  },
  {
    // 1x A1 5x R1
    cards: [
      new Card('A', 1, false, '', dummyTheme),
      new Card('R', 1, false, '', dummyTheme),
      new Card('R', 1, false, '', dummyTheme),
      new Card('R', 1, false, '', dummyTheme),
      new Card('R', 1, false, '', dummyTheme),
      new Card('R', 1, false, '', dummyTheme),
    ],
    themeBonus: 545000,
    expectedScore: 3295167,
  },

  // R99 tests - R99 FSP is 6,358,000
  //  (199 + 3) * 29,000 + 500,000
  {
    cards: [new Card('R', 99, false, '', dummyTheme, 99)],
    themeBonus: 500000,
    expectedScore: 6358000,
  },
  {
    cards: [
      new Card('R', 99, false, '', dummyTheme, 99),
      new Card('R', 99, false, '', dummyTheme, 99),
      new Card('R', 99, false, '', dummyTheme, 99),
    ],
    themeBonus: 500000,
    expectedScore: 6358000,
  },
];

describe('Score calculator basic test', () => {
  testData.forEach(({ cards, themeBonus, expectedScore }) => {
    it(`Card score from calcular for ${JSON.stringify(cards)} should be ${expectedScore}`, () => {
      expect(calculateIdealScore(cards, themeBonus)).toBe(expectedScore);
    });
  });
});

const themeTestData = [
  // R50
  {
    // 6x R1
    cards: [
      new Card('R', 1, false, '', dummyTheme),
      new Card('R', 1, false, '', dummyTheme),
      new Card('R', 1, false, '', dummyTheme),
      new Card('R', 1, false, '', dummyTheme),
      new Card('R', 1, false, '', dummyTheme),
      new Card('R', 1, false, '', dummyTheme),
    ],
    themeBonus: 545000,
  },
  {
    cards: [
      new Card('B', 1, false, '', dummyTheme),
      new Card('B', 1, false, '', dummyTheme),
      new Card('None'),
      new Card('None'),
      new Card('None'),
      new Card('None'),
    ],
    themeBonus: 5000,
  },

  {
    cards: [new Card('None'), new Card('None'), new Card('None')],
    themeBonus: 0,
  },

  // R99
  {
    cards: [
      new Card('S', 1, false, '', dummyTheme, 99),
      new Card('S', 1, false, '', dummyTheme, 99),
      new Card('S', 1, false, '', dummyTheme, 99),
    ],
    themeBonus: 250000,
  },
  {
    cards: [
      new Card('None', 1, false, '', dummyTheme, 99),
      new Card('None', 1, false, '', dummyTheme, 99),
      new Card('None', 1, false, '', dummyTheme, 99),
    ],
    themeBonus: 0,
  },
];
