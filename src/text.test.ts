
import 'jasmine';
import { mangleEmail } from './text';

const dataMangleEmailData = [
  ['test@example.com', 'te****@****le.com'],
];

describe('Card Score test', () => {
  dataMangleEmailData.forEach(([email, expected]) => {
    it(`Card score for ${email} should be ${expected}`, () => {
      expect(mangleEmail(email)).toBe(expected);
    });
  });
});
