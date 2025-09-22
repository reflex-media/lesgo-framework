import { Cluster, ClusterOptions } from 'ioredis';
import { elasticache as elasticacheConfig } from '../../config';
import { logger, isEmpty, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import { LesgoException } from '../../exceptions';

const FILE = 'lesgo.services.ElastiCacheRedisService.getClient';
const REDIS_CONN_TIMEOUT = 5000;

export interface Singleton {
  [key: string]: Cluster;
}

export const singleton: Singleton = {};

export interface ElastiCacheRedisClientOptions extends ClientOptions {
  endpoint?: string;
  port?: number;
  clusterOptions?: ClusterOptions;
}

const waitForClusterReady = (redisClient: Cluster): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('ElastiCache Redis connection timed out'));
    }, REDIS_CONN_TIMEOUT);

    redisClient.once('ready', () => {
      clearTimeout(timeout);
      resolve();
    });

    redisClient.once('error', err => {
      clearTimeout(timeout);
      reject(`ElastiCache Redis: ${err.message}`);
    });
  });
};

const getElastiCacheRedisClient = async (
  clientOpts?: ElastiCacheRedisClientOptions
) => {
  const options = validateFields(clientOpts || {}, [
    { key: 'singletonConn', type: 'string', required: false },
    { key: 'endpoint', type: 'string', required: false },
    { key: 'port', type: 'number', required: false },
    { key: 'clusterOptions', type: 'object', required: false },
  ]) as ElastiCacheRedisClientOptions;

  const singletonConn = options.singletonConn || 'default';
  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_ELASTICACHE_REDIS_CONNECTION`);
    return singleton[singletonConn];
  }

  const clusterEndpoint = options.endpoint || elasticacheConfig.redis.endpoint;
  const clusterPort = options.port || elasticacheConfig.redis.port || 6379;
  const clusterOptions = {
    dnsLookup: (address: any, callback: any) => callback(null, address),
    ...(options.clusterOptions || {}),
  };

  if (!clusterEndpoint) {
    throw new LesgoException(
      'Missing ElastiCache Redis endpoint',
      `${FILE}::MISSING_ENDPOINT`,
      500,
      { options, elasticacheConfig }
    );
  }

  const redisClient = new Cluster(
    [
      {
        host: clusterEndpoint,
        port: clusterPort,
      },
    ],
    clusterOptions
  );

  try {
    await waitForClusterReady(redisClient);
  } catch (error: any) {
    // Not ideal to base on error message but ioredis doesn't have a better way to check if it's already connected
    const errorMessage = typeof error === 'string' ? error : error?.message;
    if (errorMessage === 'ElastiCache Redis: Redis is already connecting/connected') {
      logger.debug(`${FILE}::REDIS_ALREADY_CONNECTED`, {
        error,
        errorMessage,
        clusterEndpoint,
        clusterPort,
      });
    } else {
      throw new LesgoException(
        errorMessage,
        `${FILE}::REDIS_CONNECT_ERROR`,
        500,
        {
          error,
          errorMessage,
          clusterEndpoint,
          clusterPort,
        }
      );
    }
  }

  singleton[singletonConn] = redisClient;
  logger.debug(`${FILE}::NEW_ELASTICACHE_REDIS_CONNECTION`);

  return redisClient;
};

export default getElastiCacheRedisClient;
