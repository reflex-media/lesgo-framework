import {
  ElastiCacheClient,
  DescribeCacheClustersCommand,
} from '@aws-sdk/client-elasticache';
import Redis, { Cluster, ClusterNode } from 'ioredis';
import { getSecretValue } from '../../utils/secretsmanager';
import elasticacheConfig from '../../config/elasticache';
import { logger, isEmpty, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import { LesgoException } from 'src/exceptions';

const FILE = 'lesgo.services.ElastiCacheRedisService.getClient';

export interface Singleton {
  [key: string]: Cluster;
}

const singleton: Singleton = {};

export interface ElastiCacheRedisClientOptions extends ClientOptions {
  clusterId?: string;
  secretId?: string;
}

const getElastiCacheRedisClient = async (
  clientOpts?: ElastiCacheRedisClientOptions
) => {
  const options = validateFields(clientOpts || {}, [
    { key: 'clusterId', type: 'string', required: false },
    { key: 'elastiCacheRedisSecretId', type: 'string', required: false },
    { key: 'region', type: 'string', required: false },
    { key: 'singletonConn', type: 'string', required: false },
  ]);

  const singletonConn = options.singletonConn || 'default';
  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_ELASTICACHE_REDIS_CONNECTION`);
    return singleton[singletonConn];
  }

  const region = options.region || elasticacheConfig.redis.region;
  const clusterId = options.clusterId || elasticacheConfig.redis.clusterId;
  // const secretId =
  //   options.elastiCacheRedisSecretId || elasticacheConfig.redis.secretId;

  const elasticacheClient = new ElastiCacheClient({ region });

  let nodes;
  try {
    const data = await elasticacheClient.send(
      new DescribeCacheClustersCommand({
        CacheClusterId: clusterId,
        ShowCacheNodeInfo: true,
      })
    );

    nodes = data.CacheClusters?.[0].CacheNodes?.map(node => {
      const endpoint = node.Endpoint;
      if (endpoint) {
        return { host: endpoint.Address, port: endpoint.Port };
      }
    });

    logger.debug(`${FILE}::GET_CLUSTER_SUCCESS`, { nodes });
  } catch (error) {
    throw new LesgoException(
      'Failed to get ElastiCache Redis cluster',
      `${FILE}::GET_CLUSTER_ERROR`,
      500,
      { error }
    );
  }

  if (isEmpty(nodes)) {
    throw new LesgoException(
      'Missing ElastiCache Redis cluster nodes',
      `${FILE}::MISSING_NODES`,
      500,
      { nodes, options, singletonConn, region, clusterId }
    );
  }

  // let redisPassword;
  // try {
  //   const redisSecret = await getSecretValue(secretId);
  //   redisPassword = redisSecret.password;
  // } catch (error) {
  //   throw new LesgoException(
  //     'Failed to get ElastiCache Redis secret',
  //     `${FILE}::GET_SECRET_ERROR`,
  //     500,
  //     { secretId }
  //   );
  // }

  // if (isEmpty(redisPassword)) {
  //   throw new LesgoException(
  //     'Missing ElastiCache Redis password',
  //     `${FILE}::MISSING_PASSWORD`,
  //     500
  //   );
  // }

  const redisClient = new Redis.Cluster(nodes as ClusterNode[]);

  redisClient.on('error', err => {
    logger.error(`${FILE}::REDIS_CLIENT_NOT_CONNECTED_ERROR`, { err });
  });

  redisClient.on('connect', () => {
    logger.debug(`${FILE}::REDIS_CLIENT_CONNECTED`);
  });

  await redisClient.connect();

  singleton[singletonConn] = redisClient;
  logger.debug(`${FILE}::NEW_ELASTICACHE_REDIS_CONNECTION`);

  return redisClient;
};

export default getElastiCacheRedisClient;
