import { deleteCache } from '../../redis';
import deleteRedisCache from '../../../../services/ElastiCacheRedisService/deleteRedisCache';

jest.mock('../../../../services/ElastiCacheRedisService/deleteRedisCache');

describe('getCache', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call deleteRedisCache with the correct arguments', async () => {
    const key = 'testKey';
    const region = 'ap-southeast-1';
    const singletonConn = 'default';
    const clusterOptions = {
      redisOptions: {
        tls: {}
      }
    }

    await deleteCache(key, { region, singletonConn, clusterOptions });

    expect(deleteRedisCache).toHaveBeenCalledWith(key, {
      region,
      singletonConn,
      clusterOptions
    });
  });
});
