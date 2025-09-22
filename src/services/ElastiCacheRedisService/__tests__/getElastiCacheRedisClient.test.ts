import { logger } from '../../../utils';
import getElastiCacheRedisClient, {
  singleton,
} from '../getElastiCacheRedisClient';
import { LesgoException } from '../../../exceptions';
import { Cluster } from 'ioredis';

jest.mock('../../../utils/logger');
jest.mock('../../../config/elasticache', () => ({
  redis: {
    endpoint: 'default-endpoint',
    port: 6379,
  },
}));

jest.mock('ioredis', () => ({
  Cluster: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    once: jest.fn(),
    connect: jest.fn().mockResolvedValue(true),
  })),
}));

describe('getElastiCacheRedisClient', () => {
  const defaultClientOpts = {
    singletonConn: 'custom',
    endpoint: 'testEndpoint',
    port: 1234,
    clusterOptions: {
      redisOptions: {
        tls: {},
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear singleton connections
    Object.keys(singleton).forEach(key => delete singleton[key]);
    (Cluster as jest.Mock).mockClear();
  });

  describe('Singleton Connection Management', () => {
    it('should return the existing singleton connection if it already exists', async () => {
      const mockCluster = {
        on: jest.fn(),
        once: jest.fn().mockImplementation((event, callback) => {
          if (event === 'ready') {
            setTimeout(callback, 0);
          }
        }),
        connect: jest.fn().mockResolvedValue(true),
      };

      (Cluster as jest.Mock).mockImplementation(() => mockCluster);

      await getElastiCacheRedisClient();
      await getElastiCacheRedisClient();

      expect(logger.debug).toHaveBeenCalledWith(
        'lesgo.services.ElastiCacheRedisService.getClient::REUSE_ELASTICACHE_REDIS_CONNECTION'
      );
    });

    it('should create separate singleton connections for different singletonConn values', async () => {
      const mockCluster1 = {
        on: jest.fn(),
        once: jest.fn().mockImplementation((event, callback) => {
          if (event === 'ready') {
            setTimeout(callback, 0);
          }
        }),
        connect: jest.fn().mockResolvedValue(true),
      };

      const mockCluster2 = {
        on: jest.fn(),
        once: jest.fn().mockImplementation((event, callback) => {
          if (event === 'ready') {
            setTimeout(callback, 0);
          }
        }),
        connect: jest.fn().mockResolvedValue(true),
      };

      (Cluster as jest.Mock)
        .mockImplementationOnce(() => mockCluster1)
        .mockImplementationOnce(() => mockCluster2);

      const client1 = await getElastiCacheRedisClient({
        singletonConn: 'conn1',
      });
      const client2 = await getElastiCacheRedisClient({
        singletonConn: 'conn2',
      });

      expect(client1).not.toBe(client2);
      expect(Cluster as jest.Mock).toHaveBeenCalledTimes(2);
    });
  });

  describe('Client Creation', () => {
    it('should create a new Redis client and return it if the singleton connection does not exist', async () => {
      const mockCluster = {
        on: jest.fn(),
        once: jest.fn().mockImplementation((event, callback) => {
          if (event === 'ready') {
            setTimeout(callback, 0);
          }
        }),
        connect: jest.fn().mockResolvedValue(true),
      };

      (Cluster as jest.Mock).mockImplementation(() => mockCluster);

      await getElastiCacheRedisClient(defaultClientOpts);

      expect(logger.debug).toHaveBeenCalledWith(
        'lesgo.services.ElastiCacheRedisService.getClient::NEW_ELASTICACHE_REDIS_CONNECTION'
      );
      expect(Cluster as jest.Mock).toHaveBeenCalledWith(
        [{ host: 'testEndpoint', port: 1234 }],
        expect.objectContaining({
          dnsLookup: expect.any(Function),
          redisOptions: { tls: {} },
        })
      );
    });

    it('should use default endpoint and port when not provided', async () => {
      const mockCluster = {
        on: jest.fn(),
        once: jest.fn().mockImplementation((event, callback) => {
          if (event === 'ready') {
            setTimeout(callback, 0);
          }
        }),
        connect: jest.fn().mockResolvedValue(true),
      };

      (Cluster as jest.Mock).mockImplementation(() => mockCluster);

      await getElastiCacheRedisClient();

      expect(Cluster as jest.Mock).toHaveBeenCalledWith(
        [{ host: 'default-endpoint', port: 6379 }],
        expect.objectContaining({
          dnsLookup: expect.any(Function),
        })
      );
    });

    it('should merge provided clusterOptions with defaults', async () => {
      const mockCluster = {
        on: jest.fn(),
        once: jest.fn().mockImplementation((event, callback) => {
          if (event === 'ready') {
            setTimeout(callback, 0);
          }
        }),
        connect: jest.fn().mockResolvedValue(true),
      };

      (Cluster as jest.Mock).mockImplementation(() => mockCluster);

      const customClusterOptions = {
        enableReadyCheck: true,
        redisOptions: { tls: {} },
      };

      await getElastiCacheRedisClient({
        ...defaultClientOpts,
        clusterOptions: customClusterOptions,
      });

      expect(Cluster as jest.Mock).toHaveBeenCalledWith(
        [{ host: 'testEndpoint', port: 1234 }],
        expect.objectContaining({
          dnsLookup: expect.any(Function),
          enableReadyCheck: true,
          redisOptions: { tls: {} },
        })
      );
    });
  });

  describe('Error Handling', () => {

    it('should throw LesgoException when connection times out', async () => {
      const mockCluster = {
        on: jest.fn(),
        once: jest.fn().mockImplementation((event, callback) => {
          if (event === 'error') {
            setTimeout(() => callback(new Error('Connection timeout')), 0);
          }
        }),
        connect: jest.fn().mockResolvedValue(true),
      };

      (Cluster as jest.Mock).mockImplementation(() => mockCluster);

      await expect(
        getElastiCacheRedisClient(defaultClientOpts)
      ).rejects.toThrow(LesgoException);
    });

    it('should handle Redis already connected error gracefully', async () => {
      const mockCluster = {
        on: jest.fn(),
        once: jest.fn().mockImplementation((event, callback) => {
          if (event === 'error') {
            setTimeout(
              () => callback(new Error('Redis is already connecting/connected')),
              0
            );
          }
        }),
        connect: jest.fn().mockResolvedValue(true),
      };

      (Cluster as jest.Mock).mockImplementation(() => mockCluster);

      const client = await getElastiCacheRedisClient(defaultClientOpts);

      expect(logger.debug).toHaveBeenCalledWith(
        'lesgo.services.ElastiCacheRedisService.getClient::REDIS_ALREADY_CONNECTED',
        expect.objectContaining({
          error: 'ElastiCache Redis: Redis is already connecting/connected',
          errorMessage: 'ElastiCache Redis: Redis is already connecting/connected',
          clusterEndpoint: 'testEndpoint',
          clusterPort: 1234,
        })
      );
      expect(client).toBeDefined();
    });

    it('should throw LesgoException for other Redis connection errors', async () => {
      const mockCluster = {
        on: jest.fn(),
        once: jest.fn().mockImplementation((event, callback) => {
          if (event === 'error') {
            setTimeout(() => callback(new Error('Network error')), 0);
          }
        }),
        connect: jest.fn().mockResolvedValue(true),
      };

      (Cluster as jest.Mock).mockImplementation(() => mockCluster);

      await expect(
        getElastiCacheRedisClient(defaultClientOpts)
      ).rejects.toThrow(LesgoException);
    });
  });

  describe('Field Validation', () => {
    it('should validate and handle invalid field types', async () => {
      const mockCluster = {
        on: jest.fn(),
        once: jest.fn().mockImplementation((event, callback) => {
          if (event === 'ready') {
            setTimeout(callback, 0);
          }
        }),
        connect: jest.fn().mockResolvedValue(true),
      };

      (Cluster as jest.Mock).mockImplementation(() => mockCluster);

      // Test with invalid port type
      await expect(
        getElastiCacheRedisClient({
          port: 'invalid' as any,
        })
      ).rejects.toThrow();
    });

    it('should handle undefined and null options gracefully', async () => {
      const mockCluster = {
        on: jest.fn(),
        once: jest.fn().mockImplementation((event, callback) => {
          if (event === 'ready') {
            setTimeout(callback, 0);
          }
        }),
        connect: jest.fn().mockResolvedValue(true),
      };

      (Cluster as jest.Mock).mockImplementation(() => mockCluster);

      await expect(getElastiCacheRedisClient(undefined)).resolves.toBeDefined();
      await expect(
        getElastiCacheRedisClient(null as any)
      ).resolves.toBeDefined();
    });
  });

  describe('DNS Lookup Function', () => {
    it('should use custom dnsLookup function', async () => {
      const mockCluster = {
        on: jest.fn(),
        once: jest.fn().mockImplementation((event, callback) => {
          if (event === 'ready') {
            setTimeout(callback, 0);
          }
        }),
        connect: jest.fn().mockResolvedValue(true),
      };

      (Cluster as jest.Mock).mockImplementation(() => mockCluster);

      await getElastiCacheRedisClient(defaultClientOpts);

      const clusterOptions = (Cluster as jest.Mock).mock.calls[0][1];
      expect(clusterOptions.dnsLookup).toBeDefined();
      expect(typeof clusterOptions.dnsLookup).toBe('function');

      // Test the dnsLookup function
      const callback = jest.fn();
      clusterOptions.dnsLookup('test-address', callback);
      expect(callback).toHaveBeenCalledWith(null, 'test-address');
    });
  });
});
