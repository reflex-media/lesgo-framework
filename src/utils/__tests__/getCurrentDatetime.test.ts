import getCurrentDatetime from '../../utils/getCurrentDatetime';

describe('getCurrentDatetime', () => {
  it('should return the current datetime in UTC format', () => {
    const currentDatetime = getCurrentDatetime();
    const expectedDatetime = new Date().toUTCString();

    expect(currentDatetime).toEqual(expectedDatetime);
  });
});
