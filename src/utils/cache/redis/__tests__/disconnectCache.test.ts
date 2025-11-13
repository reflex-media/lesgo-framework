import { disconnectCache } from '../../redis';
import disconnectElastiCacheRedisClient from '../../../../services/ElastiCacheRedisService/disconnectElastiCacheRedisClient';

jest.mock(
  '../../../../services/ElastiCacheRedisService/disconnectElastiCacheRedisClient'
);

describe('disconnectCache', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call disconnectElastiCacheRedisClient', async () => {
    await disconnectCache();

    expect(disconnectElastiCacheRedisClient).toHaveBeenCalledTimes(1);
    expect(disconnectElastiCacheRedisClient).toHaveBeenCalledWith();
  });

  it('should return the result from disconnectElastiCacheRedisClient', async () => {
    (disconnectElastiCacheRedisClient as jest.Mock).mockResolvedValueOnce(
      undefined
    );

    const result = await disconnectCache();

    expect(result).toBeUndefined();
    expect(disconnectElastiCacheRedisClient).toHaveBeenCalledTimes(1);
  });
});
