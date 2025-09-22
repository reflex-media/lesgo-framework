import { getClient } from '../../redis';
import getElastiCacheRedisClient from '../../../../services/ElastiCacheRedisService/getElastiCacheRedisClient';

jest.mock(
  '../../../../services/ElastiCacheRedisService/getElastiCacheRedisClient'
);

describe('getClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getElastiCacheRedisClient with the correct parameters', () => {
    const singletonConn = 'default';
    const region = 'us-west-2';
    const clusterOptions = {
      redisOptions: {
        tls: {}
      }
    }

    getClient({ singletonConn, region, clusterOptions });

    expect(getElastiCacheRedisClient).toHaveBeenCalledTimes(1);
    expect(getElastiCacheRedisClient).toHaveBeenCalledWith({
      singletonConn,
      region,
      clusterOptions
    });
  });

  it('should call getElastiCacheRedisClient with default singletonConn if not provided', () => {
    const region = 'us-west-2';

    getClient({ region });

    expect(getElastiCacheRedisClient).toHaveBeenCalledTimes(1);
    expect(getElastiCacheRedisClient).toHaveBeenCalledWith({
      region,
    });
  });

  it('should call getElastiCacheRedisClient with default region if not provided', () => {
    const singletonConn = 'default';

    getClient({ singletonConn });

    expect(getElastiCacheRedisClient).toHaveBeenCalledTimes(1);
    expect(getElastiCacheRedisClient).toHaveBeenCalledWith({
      singletonConn,
    });
  });

  it('should call getElastiCacheRedisClient with default singletonConn and region if not provided', () => {
    getClient();

    expect(getElastiCacheRedisClient).toHaveBeenCalledTimes(1);
    expect(getElastiCacheRedisClient).toHaveBeenCalledWith(undefined);
  });

  it('should call getElastiCacheRedisClient with default singletonConn and region if empty object provided', () => {
    getClient({});

    expect(getElastiCacheRedisClient).toHaveBeenCalledTimes(1);
    expect(getElastiCacheRedisClient).toHaveBeenCalledWith({});
  });
});
