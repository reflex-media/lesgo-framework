import isEmpty from '../isEmpty';

describe('test isEmpty util', () => {
  it('isEmpty should return true for undefined object', () => {
    return expect(isEmpty(undefined)).toBeTruthy();
  });

  it('isEmpty should return true for null object', () => {
    return expect(isEmpty(null)).toBeTruthy();
  });

  it('isEmpty should return true for empty string', () => {
    return expect(isEmpty('')).toBeTruthy();
  });

  it('isEmpty should return true for empty object', () => {
    return expect(isEmpty({})).toBeTruthy();
  });

  it('isEmpty should return true for empty array', () => {
    return expect(isEmpty([])).toBeTruthy();
  });

  it('isEmpty should return false for non-empty array', () => {
    return expect(isEmpty(['apple', 'banana', 'chiku'])).toBeFalsy();
  });

  it('isEmpty should return false for non-empty object', () => {
    return expect(isEmpty({ someKey: 'someValue' })).toBeFalsy();
  });
});
