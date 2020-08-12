import { Card } from './types';

import 'jasmine';

const dataCardScore: [Card, number][] = [
  // SSGF - R50
  [new Card('R'), 101],
  [new Card('R', 5), 109],
  [new Card('R', 9), 117],
  [new Card('R', 1, true), 111],
  [new Card('R', 6, true), 122],
  [new Card('R', 7, true), 124],
  [new Card('R', 9, true), 128],
  [new Card('R', 10, true), 130],

  // currently we only guarantee scores for R cards
  // [new Card('C', 1, true), 12],
];

describe('Card Score test', () => {
  dataCardScore.forEach(([card, expectedScore]) => {
    it(`Card score for ${JSON.stringify(card)} should be ${expectedScore}`, () => {
      expect(card.score).toBe(expectedScore);
    });
  });
});
