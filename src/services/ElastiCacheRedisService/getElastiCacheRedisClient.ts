import Redis, { Cluster } from 'ioredis';
import elasticacheConfig from '../../config/elasticache';
import { logger, isEmpty, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import { LesgoException } from '../../exceptions';

const FILE = 'lesgo.services.ElastiCacheRedisService.getClient';

export interface Singleton {
  [key: string]: Cluster;
}

export const singleton: Singleton = {};

export interface ElastiCacheRedisClientOptions extends ClientOptions {
  endpoint?: string;
  port?: number;
}

const getElastiCacheRedisClient = async (
  clientOpts?: ElastiCacheRedisClientOptions
) => {
  const options = validateFields(clientOpts || {}, [
    { key: 'singletonConn', type: 'string', required: false },
    { key: 'endpoint', type: 'string', required: false },
    { key: 'port', type: 'number', required: false },
  ]) as ElastiCacheRedisClientOptions;

  const singletonConn = options.singletonConn || 'default';
  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_ELASTICACHE_REDIS_CONNECTION`);
    return singleton[singletonConn];
  }

  const clusterEndpoint = options.endpoint || elasticacheConfig.redis.endpoint;
  const clusterPort = options.port || elasticacheConfig.redis.port || 6379;

  if (!clusterEndpoint) {
    throw new LesgoException(
      'Missing ElastiCache Redis endpoint',
      `${FILE}::MISSING_ENDPOINT`,
      500,
      { options, elasticacheConfig }
    );
  }

  const redisClient = new Redis.Cluster([
    {
      host: clusterEndpoint,
      port: clusterPort,
    },
  ]);

  redisClient.on('error', err => {
    logger.error(`${FILE}::REDIS_CLIENT_NOT_CONNECTED_ERROR`, { err });
  });

  redisClient.on('connect', () => {
    logger.debug(`${FILE}::REDIS_CLIENT_CONNECTED`);
  });

  try {
    await redisClient.connect();
  } catch (error: any) {
    // Not ideal to base on error message but ioredis doesn't have a better way to check if it's already connected
    if (error.message === 'Redis is already connecting/connected') {
      logger.debug(`${FILE}::REDIS_ALREADY_CONNECTED`);
    } else {
      throw new LesgoException(
        'Failed to connect to ElastiCache Redis',
        `${FILE}::REDIS_CONNECT_ERROR`,
        500,
        {
          error,
          errorMessage: error?.message,
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
