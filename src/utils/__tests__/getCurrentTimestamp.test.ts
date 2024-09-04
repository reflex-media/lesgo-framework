import getCurrentTimestamp from '../getCurrentTimestamp';

describe('getCurrentTimestamp', () => {
  it('should return the current timestamp in seconds', () => {
    const timestamp = getCurrentTimestamp();
    const expectedTimestamp = Math.floor(Date.now() / 1000);
    expect(timestamp).toBe(expectedTimestamp);
  });
});
