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
import { Cluster } from 'ioredis';
import { elasticache as elasticacheConfig } from '../../config';
import { logger, isEmpty, validateFields } from '../../utils';
import { LesgoException } from '../../exceptions';
const FILE = 'lesgo.services.ElastiCacheRedisService.getClient';
const REDIS_CONN_TIMEOUT = 5000;
export const singleton = {};
const waitForClusterReady = redisClient => {
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
const getElastiCacheRedisClient = clientOpts =>
  __awaiter(void 0, void 0, void 0, function* () {
    const options = validateFields(clientOpts || {}, [
      { key: 'singletonConn', type: 'string', required: false },
      { key: 'endpoint', type: 'string', required: false },
      { key: 'port', type: 'number', required: false },
      { key: 'clusterOptions', type: 'object', required: false },
    ]);
    const singletonConn = options.singletonConn || 'default';
    if (!isEmpty(singleton[singletonConn])) {
      logger.debug(`${FILE}::REUSE_ELASTICACHE_REDIS_CONNECTION`);
      return singleton[singletonConn];
    }
    const clusterEndpoint =
      options.endpoint || elasticacheConfig.redis.endpoint;
    const clusterPort = options.port || elasticacheConfig.redis.port || 6379;
    const clusterOptions = Object.assign(
      { dnsLookup: (address, callback) => callback(null, address) },
      options.clusterOptions || {}
    );
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
      yield waitForClusterReady(redisClient);
    } catch (error) {
      // Not ideal to base on error message but ioredis doesn't have a better way to check if it's already connected
      const errorMessage =
        typeof error === 'string'
          ? error
          : error === null || error === void 0
          ? void 0
          : error.message;
      if (
        errorMessage ===
        'ElastiCache Redis: Redis is already connecting/connected'
      ) {
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
  });
export default getElastiCacheRedisClient;
