import isDecimal from '../isDecimal';

describe('test Utils/isDecimal util', () => {
  it('should return false for string', () => {
    expect(isDecimal('1')).toBeFalsy();
    expect(isDecimal('one')).toBeFalsy();
  });

  it('should return true for decimal number', () => {
    return expect(isDecimal(1.5)).toBeTruthy();
  });
});
