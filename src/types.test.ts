import { Card } from './types';

import 'jasmine';

const dataCardScore: [Card, number][] = [
  // SSGF - R50
  [new Card('R'), 101],
  [new Card('R', 2), 103],
  [new Card('R', 3), 105],
  [new Card('R', 5), 109],
  [new Card('R', 8), 115],
  [new Card('R', 9), 117],
  [new Card('R', 12), 123],
  [new Card('R', 35), 169],
  [new Card('R', 50), 199],

  [new Card('R', 1, true), 111],
  [new Card('R', 5, true), 119],
  [new Card('R', 6, true), 122],
  [new Card('R', 7, true), 124],
  [new Card('R', 8, true), 126],
  [new Card('R', 9, true), 128],
  [new Card('R', 10, true), 130],
  [new Card('R', 35, true), 185],
  [new Card('R', 50, true), 218],

  // currently we only guarantee scores for R cards
  // [new Card('C', 1, true), 12],

  // R99 tests
  [new Card('R', 1, false, '', { name: '', album: '' }, 99), 101],
  [new Card('R', 99, false, '', { name: '', album: '' }, 99), 199],
];

describe('Card Score test', () => {
  dataCardScore.forEach(([card, expectedScore]) => {
    it(`Card score for ${JSON.stringify(card)} should be ${expectedScore}`, () => {
      expect(card.score).toBe(expectedScore);
    });
  });
});
