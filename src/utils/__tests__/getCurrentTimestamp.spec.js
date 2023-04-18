import getCurrentTimestamp from '../getCurrentTimestamp';

describe('UtilsGroup: test getCurrentTimestamp', () => {
  it('test generating current timestamp', async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const currentTimestamp = getCurrentTimestamp();

    expect(currentTimestamp).toEqual(timestamp);
  });
});
