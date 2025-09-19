import { setCache } from '../../redis';
import setRedisCache from '../../../../services/ElastiCacheRedisService/setRedisCache';

jest.mock('../../../../services/ElastiCacheRedisService/setRedisCache');

describe('getCache', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call setRedisCache with the correct arguments', async () => {
    const key = 'testKey';
    const value = 'testValue';
    const opts = { EX: 10 };
    const region = 'ap-southeast-1';
    const singletonConn = 'default';
    const clusterOptions = {
      redisOptions: {
        tls: {}
      }
    }

    await setCache(key, value, opts, { region, singletonConn, clusterOptions });

    expect(setRedisCache).toHaveBeenCalledWith(key, value, opts, {
      region,
      singletonConn,
      clusterOptions
    });
  });
});
