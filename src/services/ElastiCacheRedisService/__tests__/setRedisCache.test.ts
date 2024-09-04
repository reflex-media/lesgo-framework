import { SetRedisCacheOptions } from '../setRedisCache';
import getElastiCacheRedisClient from '../getElastiCacheRedisClient';
import { setRedisCache } from '../../ElastiCacheRedisService';
import { LesgoException } from '../../../exceptions';
import logger from '../../../utils/logger';

jest.mock('../getElastiCacheRedisClient');
jest.mock('../../../utils/logger');

describe('setRedisCache', () => {
  const mockClient = {
    set: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getElastiCacheRedisClient as jest.Mock).mockResolvedValue(mockClient);
  });

  it('should set the cache with default expiry time if not provided for string value', async () => {
    const key = 'testKey';
    const value = 'testValue';
    const opts: SetRedisCacheOptions = {};

    const result = await setRedisCache(key, value, opts);

    expect(getElastiCacheRedisClient).toHaveBeenCalledTimes(1);
    expect(getElastiCacheRedisClient).toHaveBeenCalledWith(undefined);

    expect(mockClient.set).toHaveBeenCalledTimes(1);
    expect(mockClient.set).toHaveBeenCalledWith(key, value, 'EX', 300);

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.ElastiCacheRedis.setRedisCache::RECEIVED_RESPONSE',
      { resp: undefined, input: { key, value }, value }
    );

    expect(result).toBeUndefined();
  });

  it('should set the cache with provided expiry time for object value', async () => {
    const key = 'testKey';
    const value = { foo: 'bar' };
    const opts: SetRedisCacheOptions = { EX: 600 };

    const result = await setRedisCache(key, value, opts);

    expect(getElastiCacheRedisClient).toHaveBeenCalledTimes(1);
    expect(getElastiCacheRedisClient).toHaveBeenCalledWith(undefined);

    expect(mockClient.set).toHaveBeenCalledTimes(1);
    expect(mockClient.set).toHaveBeenCalledWith(
      key,
      JSON.stringify(value),
      'EX',
      600
    );

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.ElastiCacheRedis.setRedisCache::RECEIVED_RESPONSE',
      { resp: undefined, input: { key, value: JSON.stringify(value) }, value }
    );

    expect(result).toBeUndefined();
  });

  it('should throw an exception when failed to set redis cache', async () => {
    const key = 'testKey';
    const value = { foo: 'bar' };
    const opts: SetRedisCacheOptions = {};

    const error = new Error('Failed to set cache');

    mockClient.set.mockRejectedValue(error);

    await expect(setRedisCache(key, value, opts)).rejects.toThrow(
      new LesgoException(
        'Failed to set redis cache',
        'lesgo.services.ElastiCacheRedis.setRedisCache::SET_ERROR',
        500,
        {
          err: error,
          input: { key, value },
          value,
          opts,
          clientOpts: undefined,
        }
      )
    );
  });
});
