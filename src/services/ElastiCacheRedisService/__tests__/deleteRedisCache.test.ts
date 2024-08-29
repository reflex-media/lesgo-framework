import { deleteRedisCache } from '../../ElastiCacheRedisService';
import getElastiCacheRedisClient from '../getElastiCacheRedisClient';
import { LesgoException } from '../../../exceptions';
import logger from '../../../utils/logger';

jest.mock('../getElastiCacheRedisClient');
jest.mock('../../../utils/logger');

describe('deleteRedisCache', () => {
  const mockClient = {
    del: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getElastiCacheRedisClient as jest.Mock).mockResolvedValue(mockClient);
  });

  it('should delete the redis cache when valid input is provided', async () => {
    const key = 'testKey';
    const input = { key };

    mockClient.del.mockResolvedValue(1);

    const result = await deleteRedisCache(key);

    expect(getElastiCacheRedisClient).toHaveBeenCalledTimes(1);
    expect(getElastiCacheRedisClient).toHaveBeenCalledWith(undefined);

    expect(mockClient.del).toHaveBeenCalledTimes(1);
    expect(mockClient.del).toHaveBeenCalledWith(key);

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.ElastiCacheRedis.deleteRedisCache::RECEIVED_RESPONSE',
      { resp: 1, input }
    );

    expect(result).toEqual(1);
  });

  it('should throw an exception when invalid input is provided', async () => {
    const key = 123;

    // @ts-ignore
    await expect(deleteRedisCache(key)).rejects.toThrow(
      new LesgoException("Invalid type for 'key', expecting 'string'")
    );
  });

  it('should throw an exception when client.del fails', async () => {
    const key = 'abc';
    const input = { key };

    mockClient.del.mockRejectedValue(new Error('Mock Error exception'));

    await expect(deleteRedisCache(key)).rejects.toThrow(
      new LesgoException(
        'Failed to delete redis cache',
        'lesgo.services.ElastiCacheRedis.deleteRedisCache::DELETE_ERROR',
        500,
        {
          err: expect.any(Error),
          input,
          clientOpts: undefined,
        }
      )
    );
  });
});
