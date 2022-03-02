import cache from '../cache';

export const cacheKey = 'cacheKey';
export const cacheKey2 = 'cacheKey2';
export const cacheTime = 10;
export const cacheData = {
  someData: [
    {
      someDataKey1: 'someDataValue1',
    },
    {
      someDataKey2: 'someDataValue2',
    },
  ],
};
export const cacheData2 = 'someValue2';

describe('UtilsGroup: test cache utils', () => {
  it('test cache utils', async () => {
    await expect(cache.set(cacheKey, cacheData, cacheTime)).resolves.toBe();
    await expect(cache.set(cacheKey2, cacheData2, cacheTime)).resolves.toBe();

    await expect(cache.get(cacheKey)).resolves.toMatchObject(cacheData);
    await expect(cache.getMulti([cacheKey, cacheKey2])).resolves.toMatchObject([
      cacheData,
      cacheData2,
    ]);

    await expect(cache.del(cacheKey)).resolves.toBe();
    await expect(cache.delMulti([cacheKey, cacheKey2])).resolves.toBe();

    await expect(cache.end()).resolves.toBe();
    await expect(cache.disconnect()).resolves.toBe();
  });

  it('test setting cache with exception', async () => {
    await expect(
      cache.set('mockException', cacheData, cacheTime)
    ).rejects.toMatchObject({
      code: 'CACHE_SET_EXCEPTION',
      message: 'mockedException',
      name: 'LesgoException',
      statusCode: 500,
    });
  });

  it('test getting cache with exception', async () => {
    await expect(cache.get('mockException')).rejects.toMatchObject({
      code: 'CACHE_GET_EXCEPTION',
      message: 'mockedException',
      name: 'LesgoException',
      statusCode: 500,
    });
  });

  it('test getting multiple cache with exception', async () => {
    await expect(cache.getMulti(['mockException'])).rejects.toMatchObject({
      code: 'CACHE_GET_MULTI_EXCEPTION',
      message: 'mockedException',
      name: 'LesgoException',
      statusCode: 500,
    });
  });

  it('test deleting cache with exception', async () => {
    await expect(cache.del('mockException')).rejects.toMatchObject({
      code: 'CACHE_DEL_EXCEPTION',
      message: 'mockedException',
      name: 'LesgoException',
      statusCode: 500,
    });
  });

  it('test deleting multiple cache with exception', async () => {
    await expect(cache.delMulti(['mockException'])).rejects.toMatchObject({
      code: 'CACHE_DEL_MULTI_EXCEPTION',
      message: 'mockedException',
      name: 'LesgoException',
      statusCode: 500,
    });
  });
});
