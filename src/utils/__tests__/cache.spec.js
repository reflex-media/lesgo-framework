import cache from '../cache';

describe('UtilsGroup: test cache utils', () => {
  it('test setting cache', () => {
    const cacheKey = 'data';
    const cacheData = {
      someData: [
        {
          someDataKey1: 'someDataValue1',
        },
        {
          someDataKey2: 'someDataValue2',
        },
      ],
    };

    expect(cache().set(cacheKey, cacheData, 10)).toMatchObject({
      mocked: {
        cacheKey,
        cacheData,
        cacheTime: 10,
      },
    });
  });

  it('test getting cache', () => {
    const cacheKey = 'data';

    expect(cache().get(cacheKey)).toMatchObject({
      mocked: {
        cacheKey,
      },
    });
  });
});
