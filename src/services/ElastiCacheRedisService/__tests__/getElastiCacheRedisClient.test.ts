import { logger } from '../../../utils';
import getElastiCacheRedisClient from '../getElastiCacheRedisClient';

jest.mock('../../../utils/logger');
jest.mock('ioredis', () => {
  const mCluster = jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    connect: jest.fn().mockResolvedValue(true),
  }));

  return {
    Cluster: mCluster,
  };
});

describe('getElastiCacheRedisClient', () => {
  const clientOpts = {
    singletonConn: 'custom',
    endpoint: 'testEndpoint',
    port: 1234,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the existing singleton connection if it already exists', async () => {
    await getElastiCacheRedisClient();
    await getElastiCacheRedisClient();

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.ElastiCacheRedisService.getClient::REUSE_ELASTICACHE_REDIS_CONNECTION'
    );
  });

  it('should create a new Redis client and return it if the singleton connection does not exist', async () => {
    await getElastiCacheRedisClient(clientOpts);

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.ElastiCacheRedisService.getClient::NEW_ELASTICACHE_REDIS_CONNECTION'
    );
  });
});
