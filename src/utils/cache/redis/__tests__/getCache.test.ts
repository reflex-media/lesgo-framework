import { getCache } from '../../redis';
import getRedisCache from '../../../../services/ElastiCacheRedisService/getRedisCache';

jest.mock('../../../../services/ElastiCacheRedisService/getRedisCache');

describe('getCache', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getRedisCache with the correct arguments', async () => {
    const key = 'testKey';
    const region = 'ap-southeast-1';
    const singletonConn = 'default';

    await getCache(key, { region, singletonConn });

    expect(getRedisCache).toHaveBeenCalledWith(key, {
      region,
      singletonConn,
    });
  });
});
