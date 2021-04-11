
import 'jasmine';
import { scoreBonusCountdown, scoreBonusInDateRange } from './utils';

const scoreBonusDateData: [Date, Date, boolean][] = [
  [ new Date('2020-06-10T11:00:00Z'), new Date('2020-06-06T00:00:00Z'), false ],
  [ new Date('2020-06-10T11:00:00Z'), new Date('2020-06-06T14:00:00Z'), false ],
  [ new Date('2020-06-10T11:00:00Z'), new Date('2020-06-06T16:00:00+02:00'), false ],
  [ new Date('2020-06-10T11:00:00Z'), new Date('2020-06-06T16:59:00+02:00'), false ], // not yet in KST
  [ new Date('2020-06-10T11:00:00Z'), new Date('2020-06-06T16:00:00Z'), true ], // yes in KST
  [ new Date('2020-06-10T11:00:00Z'), new Date('2020-06-07T00:00:00Z'), true ],
  [ new Date('2020-06-10T11:00:00Z'), new Date('2020-06-07T11:00:00Z'), true ],
  [ new Date('2020-06-10T11:00:00Z'), new Date('2020-06-08T11:00:00Z'), true ],
  [ new Date('2020-06-10T11:00:00Z'), new Date('2020-06-09T11:00:00Z'), true ],
  [ new Date('2020-06-10T11:00:00Z'), new Date('2020-06-10T11:00:00Z'), true ],
  [ new Date('2020-06-10T11:00:00Z'), new Date('2020-06-11T11:00:00Z'), true ],
  [ new Date('2020-06-10T11:00:00Z'), new Date('2020-06-12T11:00:00Z'), true ],
  [ new Date('2020-06-10T11:00:00Z'), new Date('2020-06-13T11:00:00Z'), true ],
  [ new Date('2020-06-10T11:00:00Z'), new Date('2020-06-13T16:59:00+02:00'), true ],
  [ new Date('2020-06-10T11:00:00Z'), new Date('2020-06-13T17:00:00+02:00'), false ],

  [ new Date('2020-12-31T11:00:00Z'), new Date('2021-01-01T11:00:00Z'), true ],
];

describe('Score bonus date test', () => {
  scoreBonusDateData.forEach(([ datePoint, dateNow, expected ]) => {
    it(`Score bonus date for ${dateNow} within ${datePoint} should be ${expected}`, () => {
      expect(scoreBonusInDateRange(datePoint, dateNow)).toBe(expected);
    });
  });
});

const scoreBonusCountdownData: [Date, Date, number][] = [
  [ new Date('2020-06-10T11:00:00Z'), new Date('2020-06-06T00:00:00Z'), 1 ],
  [ new Date('2020-11-31T11:00:00Z'), new Date('2021-01-01T11:00:00Z'), 331 ],
];

describe('Score bonus countdown test', () => {
  scoreBonusCountdownData.forEach(([ datePoint, dateNow, expected ]) => {
    it(`Score bonus date for ${dateNow} within ${datePoint} should be ${expected}`, () => {
      expect(scoreBonusCountdown(datePoint, dateNow)).toBe(expected);
    });
  });
});
