import cache from '../cache';

describe('UtilsGroup: test cache utils', () => {
  const cacheKey = 'cacheKey';
  const cacheTime = 10;
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

  it('test cache utils', async () => {
    await expect(cache.set(cacheKey, cacheData, cacheTime)).resolves.toEqual(
      true
    );

    await expect(cache.get(cacheKey)).resolves.toMatchObject({
      data: cacheData,
      lifetime: cacheTime,
    });

    await expect(cache.del(cacheKey)).resolves.toEqual(true);
  });

  it('test setting cache with error', async () => {
    await expect(
      cache.set('mockError', cacheData, cacheTime)
    ).rejects.toMatchObject({
      code: 'CACHE_SET_ERROR',
      message: 'mockedError',
      name: 'LesgoException',
      statusCode: 500,
    });
  });

  it('test getting cache with error', async () => {
    await expect(cache.get('mockError')).rejects.toMatchObject({
      code: 'CACHE_GET_ERROR',
      message: 'mockedError',
      name: 'LesgoException',
      statusCode: 500,
    });
  });

  it('test deleting cache with error', async () => {
    await expect(cache.del('mockError')).rejects.toMatchObject({
      code: 'CACHE_DEL_ERROR',
      message: 'mockedError',
      name: 'LesgoException',
      statusCode: 500,
    });
  });

  it('test setting cache with exception', async () => {
    await expect(
      cache.set('mockException', cacheData, cacheTime)
    ).rejects.toMatchObject({
      code: 'CACHE_SET_EXCEPTION',
    });
  });

  it('test getting cache with exception', async () => {
    await expect(cache.get('mockException')).rejects.toMatchObject({
      code: 'CACHE_GET_EXCEPTION',
    });
  });

  it('test deleting cache with exception', async () => {
    await expect(cache.del('mockException')).rejects.toMatchObject({
      code: 'CACHE_DEL_EXCEPTION',
    });
  });
});
