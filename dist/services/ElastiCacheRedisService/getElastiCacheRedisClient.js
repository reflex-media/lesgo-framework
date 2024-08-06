var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import {
  ElastiCacheClient,
  DescribeCacheClustersCommand,
} from '@aws-sdk/client-elasticache';
import Redis from 'ioredis';
import elasticacheConfig from '../../config/elasticache';
import { logger, isEmpty, validateFields } from '../../utils';
import { LesgoException } from 'src/exceptions';
const FILE = 'lesgo.services.ElastiCacheRedisService.getClient';
const singleton = {};
const getElastiCacheRedisClient = clientOpts =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
      const data = yield elasticacheClient.send(
        new DescribeCacheClustersCommand({
          CacheClusterId: clusterId,
          ShowCacheNodeInfo: true,
        })
      );
      nodes =
        (_b =
          (_a = data.CacheClusters) === null || _a === void 0
            ? void 0
            : _a[0].CacheNodes) === null || _b === void 0
          ? void 0
          : _b.map(node => {
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
    const redisClient = new Redis.Cluster(nodes);
    redisClient.on('error', err => {
      logger.error(`${FILE}::REDIS_CLIENT_NOT_CONNECTED_ERROR`, { err });
    });
    redisClient.on('connect', () => {
      logger.debug(`${FILE}::REDIS_CLIENT_CONNECTED`);
    });
    yield redisClient.connect();
    singleton[singletonConn] = redisClient;
    logger.debug(`${FILE}::NEW_ELASTICACHE_REDIS_CONNECTION`);
    return redisClient;
  });
export default getElastiCacheRedisClient;
