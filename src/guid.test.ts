import 'jasmine';
import { microtime, generate_guid } from './guid';

describe('microtime', () => {
  it('as float', () => {
    expect(microtime(true)).toMatch(/^\d+\.\d+$/);
  });
  it('as string', () => {
    expect(microtime(false)).toMatch(/^\d+\.\d+ \d+$/);
  });
});

describe('guid', () => {
  it('has a length of 22 letters', () => {
    expect(generate_guid().length).toBe(22);
  });
  it('is a string', () => {
    expect(typeof generate_guid()).toBe('string');
  });
});
