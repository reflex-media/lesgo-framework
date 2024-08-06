import {
  ElastiCacheClient,
  DescribeCacheClustersCommand,
} from '@aws-sdk/client-elasticache';
import Redis, { Cluster, ClusterNode } from 'ioredis';
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
  clusterId?: string;
  secretId?: string;
  endpoint?: string;
  port?: number;
}

const getElastiCacheRedisClient = async (
  clientOpts?: ElastiCacheRedisClientOptions
) => {
  const options = validateFields(clientOpts || {}, [
    { key: 'clusterId', type: 'string', required: false },
    { key: 'elastiCacheRedisSecretId', type: 'string', required: false },
    { key: 'region', type: 'string', required: false },
    { key: 'singletonConn', type: 'string', required: false },
    { key: 'endpoint', type: 'string', required: false },
    { key: 'port', type: 'number', required: false },
  ]) as ElastiCacheRedisClientOptions;

  const singletonConn = options.singletonConn || 'default';
  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_ELASTICACHE_REDIS_CONNECTION`);
    return singleton[singletonConn];
  }

  // const region = options.region || elasticacheConfig.redis.region;
  // const clusterId = options.clusterId || elasticacheConfig.redis.clusterId;
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

  // const elasticacheClient = new ElastiCacheClient({ region });

  // try {
  //   cacheClient = await elasticacheClient.send(
  //     new DescribeCacheClustersCommand({})
  //   );
  // } catch (err) {
  //   logger.error(`${FILE}::ERROR_LISTING_CACHE_CLUSTERS`, { err });
  // }

  // data.CacheClusters?.forEach(cluster => {
  //   logger.debug(
  //     `${FILE}::CLUSTER_ID: ${cluster.CacheClusterId}, Status: ${cluster.CacheClusterStatus}`
  //   );
  // });

  // let cacheClient;

  // try {
  //   cacheClient = await elasticacheClient.send(
  //     new DescribeCacheClustersCommand({
  //       CacheClusterId: clusterId,
  //       ShowCacheNodeInfo: true,
  //     })
  //   );
  //   logger.debug(`${FILE}::GET_CACHE_CLIENT_SUCCESS`, { cacheClient });
  // } catch (error) {
  //   throw new LesgoException(
  //     'Failed to get Cache Client',
  //     `${FILE}::GET_CACHE_CLIENT_ERROR`,
  //     500,
  //     { error }
  //   );
  // }

  // if (
  //   !cacheClient ||
  //   !cacheClient.CacheClusters ||
  //   cacheClient.CacheClusters.length === 0
  // ) {
  //   throw new LesgoException(
  //     'Failed to get Cache Clusters',
  //     `${FILE}::CACHE_CLUSTER_NOT_FOUND`,
  //     500,
  //     { cacheClient }
  //   );
  // }

  // const nodes = cacheClient.CacheClusters?.[0].CacheNodes?.map(node => {
  //   const endpoint = node.Endpoint;
  //   if (endpoint) {
  //     return { host: endpoint.Address, port: endpoint.Port };
  //   }
  // });
  // logger.debug(`${FILE}::GET_CLUSTER_SUCCESS`, { nodes });

  // if (isEmpty(nodes)) {
  //   throw new LesgoException(
  //     'Missing ElastiCache Redis cluster nodes',
  //     `${FILE}::MISSING_NODES`,
  //     500,
  //     { nodes, options, singletonConn, region, clusterId }
  //   );
  // }

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
