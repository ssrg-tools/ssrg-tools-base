import { Card } from './types';
import { calculateIdealScore } from './score-calculator';
import 'jasmine';

const testData: {
  cards: Card[],
  themeBonus: number,
  expectedScore: number,
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
  //     new Card('B', 1, false, '', { name: 'foo', album: 'bar' }),
  //     new Card('B', 1, false, '', { name: 'foo', album: 'bar' }),
  //     new Card('None'),
  //     new Card('None'),
  //     new Card('None'),
  //     new Card('None'),
  //   ],
  //   themeBonus: 5000,
  //   expectedScore: 300000,
  // },
  {
    cards: [
      new Card('R', 50),
    ],
    themeBonus: 545000,
    expectedScore: 6403000,
  },
  {
    cards: [
      new Card('R', 50, true),
    ],
    themeBonus: 545000,
    expectedScore: 6954000,
  },
  { // 6x R1
    cards: [
      new Card('R', 1, false, '', { name: 'foo', album: 'bar' }),
      new Card('R', 1, false, '', { name: 'foo', album: 'bar' }),
      new Card('R', 1, false, '', { name: 'foo', album: 'bar' }),
      new Card('R', 1, false, '', { name: 'foo', album: 'bar' }),
      new Card('R', 1, false, '', { name: 'foo', album: 'bar' }),
      new Card('R', 1, false, '', { name: 'foo', album: 'bar' }),
    ],
    themeBonus: 545000,
    expectedScore: 3561000,
  },
  { // 1x A1 5x R1
    cards: [
      new Card('A', 1, false, '', { name: 'foo', album: 'bar' }),
      new Card('R', 1, false, '', { name: 'foo', album: 'bar' }),
      new Card('R', 1, false, '', { name: 'foo', album: 'bar' }),
      new Card('R', 1, false, '', { name: 'foo', album: 'bar' }),
      new Card('R', 1, false, '', { name: 'foo', album: 'bar' }),
      new Card('R', 1, false, '', { name: 'foo', album: 'bar' }),
    ],
    themeBonus: 545000,
    expectedScore: 3295167,
  },
];

describe('Score calculator basic test', () => {
  testData.forEach(({cards, themeBonus, expectedScore}) => {
    it(`Card score from calcular for ${JSON.stringify(cards)} should be ${expectedScore}`, () => {
      expect(calculateIdealScore(cards, themeBonus)).toBe(expectedScore);
    });
  });
});
