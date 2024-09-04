import getElastiCacheRedisClient from '../getElastiCacheRedisClient';
import { getRedisCache } from '../../ElastiCacheRedisService';
import { LesgoException } from '../../../exceptions';
import logger from '../../../utils/logger';

jest.mock('../getElastiCacheRedisClient');
jest.mock('../../../utils/logger');

describe('getRedisCache', () => {
  const mockClient = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getElastiCacheRedisClient as jest.Mock).mockResolvedValue(mockClient);
  });

  it('should return the cached data when it exists', async () => {
    const key = 'testKey';
    const data = { foo: 'bar' };
    const resp = JSON.stringify(data);

    mockClient.get.mockResolvedValue(resp);

    const result = await getRedisCache(key);

    expect(getElastiCacheRedisClient).toHaveBeenCalledTimes(1);
    expect(getElastiCacheRedisClient).toHaveBeenCalledWith(undefined);

    expect(mockClient.get).toHaveBeenCalledTimes(1);
    expect(mockClient.get).toHaveBeenCalledWith(key);

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.ElastiCacheRedis.getRedisCache::RECEIVED_RESPONSE',
      { resp, input: { key } }
    );

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.ElastiCacheRedis.getRedisCache::DATA_IS_JSON',
      { data }
    );

    expect(result).toEqual(data);
  });

  it('should return null when the cached data is empty', async () => {
    const key = 'testKey';
    const resp = null;

    mockClient.get.mockResolvedValue(resp);

    const result = await getRedisCache(key);

    expect(getElastiCacheRedisClient).toHaveBeenCalledTimes(1);
    expect(getElastiCacheRedisClient).toHaveBeenCalledWith(undefined);

    expect(mockClient.get).toHaveBeenCalledTimes(1);
    expect(mockClient.get).toHaveBeenCalledWith(key);

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.ElastiCacheRedis.getRedisCache::RECEIVED_RESPONSE',
      { resp, input: { key } }
    );

    expect(result).toBeNull();
  });

  it('should return the cached data when it is not JSON', async () => {
    const key = 'testKey';
    const resp = 'not-json';

    mockClient.get.mockResolvedValue(resp);

    const result = await getRedisCache(key);

    expect(getElastiCacheRedisClient).toHaveBeenCalledTimes(1);
    expect(getElastiCacheRedisClient).toHaveBeenCalledWith(undefined);

    expect(mockClient.get).toHaveBeenCalledTimes(1);
    expect(mockClient.get).toHaveBeenCalledWith(key);

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.ElastiCacheRedis.getRedisCache::RECEIVED_RESPONSE',
      { resp, input: { key } }
    );

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.ElastiCacheRedis.getRedisCache::DATA_NOT_JSON',
      { resp }
    );

    expect(result).toEqual(resp);
  });

  it('should throw an exception when failed to get redis cache', async () => {
    const key = 'testKey';
    const error = new Error('Failed to get cache');

    mockClient.get.mockRejectedValue(error);

    await expect(getRedisCache(key)).rejects.toThrow(
      new LesgoException(
        'Failed to get redis cache',
        'lesgo.services.ElastiCacheRedis.getRedisCache::GET_ERROR',
        500,
        {
          err: error,
          input: { key },
          clientOpts: undefined,
        }
      )
    );
  });
});
