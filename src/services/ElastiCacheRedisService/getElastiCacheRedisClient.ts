import {
  ElastiCacheClient,
  DescribeCacheClustersCommand,
} from '@aws-sdk/client-elasticache';
import redis from 'redis';
import { getSecretValue } from '../../utils/secretsmanager';
import elasticacheConfig from '../../config/elasticache';
import { logger, isEmpty, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import { LesgoException } from 'src/exceptions';

const FILE = 'lesgo.services.ElastiCacheRedisService.getClient';

export interface Singleton {
  [key: string]: any;
}

const singleton: Singleton = {};

export interface ElastiCacheRedisClientOptions extends ClientOptions {
  clusterId?: string;
  secretId?: string;
}

const getElastiCacheRedisClient = async (
  clientOpts?: ElastiCacheRedisClientOptions
) => {
  // const options = validateFields(clientOpts || {}, [
  //   { key: 'clusterId', type: 'string', required: false },
  //   { key: 'elastiCacheRedisSecretId', type: 'string', required: false },
  //   { key: 'region', type: 'string', required: false },
  //   { key: 'singletonConn', type: 'string', required: false },
  // ]);

  // const region = options.region || elasticacheConfig.redis.region;
  // const singletonConn = options.singletonConn || 'default';
  // const clusterId = options.clusterId || elasticacheConfig.redis.clusterId;
  // const secretId =
  //   options.elastiCacheRedisSecretId || elasticacheConfig.redis.secretId;

  // if (!isEmpty(singleton[singletonConn])) {
  //   logger.debug(`${FILE}::REUSE_ELASTICACHE_REDIS_CONNECTION`);
  //   return singleton[singletonConn];
  // }

  // const elasticacheClient = new ElastiCacheClient({ region });
  // const command = new DescribeCacheClustersCommand({
  //   CacheClusterId: clusterId,
  //   ShowCacheNodeInfo: true,
  // });

  // let redisCluster;
  // try {
  //   redisCluster = await elasticacheClient.send(command);
  // } catch (error) {
  //   throw new LesgoException(
  //     'Failed to get ElastiCache Redis cluster',
  //     `${FILE}::GET_CLUSTER_ERROR`,
  //     500,
  //     { command }
  //   );
  // }

  // const redisEndpoint =
  //   redisCluster.CacheClusters?.[0]?.CacheNodes?.[0]?.Endpoint?.Address || '';
  // if (isEmpty(redisEndpoint)) {
  //   throw new LesgoException(
  //     'Failed to get ElastiCache Redis endpoint',
  //     `${FILE}::GET_ENDPOINT_ERROR`,
  //     500,
  //     { redisCluster }
  //   );
  // }

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

  const client = redis.createClient({
    url: `redis://${elasticacheConfig.redis.endpoint}`,
  });

  client.on('error', err => {
    logger.error(`${FILE}::REDIS_CLIENT_NOT_CONNECTED_ERROR`, { err });
  });

  client.on('connect', () => {
    logger.debug(`${FILE}::REDIS_CLIENT_CONNECTED`);
  });

  await client.connect();

  // singleton[singletonConn] = client;
  logger.debug(`${FILE}::NEW_ELASTICACHE_REDIS_CONNECTION`);

  return client;
};

export default getElastiCacheRedisClient;
