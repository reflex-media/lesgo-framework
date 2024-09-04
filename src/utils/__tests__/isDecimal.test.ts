import isDecimal from '../isDecimal';

describe('isDecimal', () => {
  it('should return true for decimal numbers', () => {
    expect(isDecimal(3.14)).toBe(true);
    expect(isDecimal(0.5)).toBe(true);
    expect(isDecimal(-2.75)).toBe(true);
  });

  it('should return false for non-decimal numbers', () => {
    expect(isDecimal(42)).toBe(false);
    expect(isDecimal(0)).toBe(false);
    expect(isDecimal(-10)).toBe(false);
  });

  it('should return false for non-numeric values', () => {
    expect(isDecimal('3.14')).toBe(false);
    expect(isDecimal('0.5')).toBe(false);
    expect(isDecimal('abc')).toBe(false);
  });
});
