import { describe, expect, test } from 'vitest';
import { clamp } from './utils.ts';

describe('utils', () => {
  describe('clamp', () => {
    test('should clamp value when its above the range', () => {
      expect(clamp(10, 1, 5)).to.equal(5);
    });
  });
});
