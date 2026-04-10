import { describe, expect, it } from 'vitest';
import { calculateFact, getCellContribution } from '../src/utils/calculateFact.js';

describe('getCellContribution', () => {
  it('returns 0 for empty values', () => {
    expect(getCellContribution('')).toBe(0);
    expect(getCellContribution('   ')).toBe(0);
    expect(getCellContribution(null)).toBe(0);
    expect(getCellContribution(undefined)).toBe(0);
  });

  it('returns numeric value for pure numbers', () => {
    expect(getCellContribution('5')).toBe(5);
    expect(getCellContribution(' 10 ')).toBe(10);
    expect(getCellContribution('-2')).toBe(-2);
  });

  it('returns 1 for non-empty non-numeric text', () => {
    expect(getCellContribution('done')).toBe(1);
    expect(getCellContribution('10к')).toBe(1);
    expect(getCellContribution('2 раза')).toBe(1);
    expect(getCellContribution('abc123')).toBe(1);
  });
});

describe('calculateFact', () => {
  it('sums contributions by business rules', () => {
    expect(
      calculateFact({
        '1': '',
        '2': 'done',
        '3': '5',
        '4': ' 10 ',
        '5': '2 раза'
      })
    ).toBe(17);
  });
});
