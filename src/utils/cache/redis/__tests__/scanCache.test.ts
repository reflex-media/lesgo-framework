import { scanCache } from '../../redis';
import scanRedisCache from '../../../../services/ElastiCacheRedisService/scanRedisCache';
import { ClientOptions } from '../../../../types/aws';

jest.mock('../../../../services/ElastiCacheRedisService/scanRedisCache');

describe('scanCache', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call scanRedisCache with the correct arguments', async () => {
    const pattern = 'getUser:byId:*';
    const clientOpts: ClientOptions = {
      region: 'us-west-2',
      singletonConn: 'default',
    };

    await scanCache(pattern, clientOpts);

    expect(scanRedisCache).toHaveBeenCalledWith(pattern, clientOpts);
  });

  it('should call scanRedisCache with pattern only when clientOpts not provided', async () => {
    const pattern = 'getUser:*';

    await scanCache(pattern);

    expect(scanRedisCache).toHaveBeenCalledWith(pattern, undefined);
  });

  it('should return the result from scanRedisCache', async () => {
    const pattern = 'getUser:byId:*';
    const mockKeys = ['getUser:byId:1', 'getUser:byId:2'];
    (scanRedisCache as jest.Mock).mockResolvedValueOnce(mockKeys);

    const result = await scanCache(pattern);

    expect(result).toEqual(mockKeys);
  });
});
