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
import Redis from 'ioredis';
import elasticacheConfig from '../../config/elasticache';
import { logger, isEmpty, validateFields } from '../../utils';
import { LesgoException } from '../../exceptions';
const FILE = 'lesgo.services.ElastiCacheRedisService.getClient';
export const singleton = {};
const getElastiCacheRedisClient = clientOpts =>
  __awaiter(void 0, void 0, void 0, function* () {
    const options = validateFields(clientOpts || {}, [
      { key: 'singletonConn', type: 'string', required: false },
      { key: 'endpoint', type: 'string', required: false },
      { key: 'port', type: 'number', required: false },
    ]);
    const singletonConn = options.singletonConn || 'default';
    if (!isEmpty(singleton[singletonConn])) {
      logger.debug(`${FILE}::REUSE_ELASTICACHE_REDIS_CONNECTION`);
      return singleton[singletonConn];
    }
    const clusterEndpoint =
      options.endpoint || elasticacheConfig.redis.endpoint;
    const clusterPort = options.port || elasticacheConfig.redis.port || 6379;
    if (!clusterEndpoint) {
      throw new LesgoException(
        'Missing ElastiCache Redis endpoint',
        `${FILE}::MISSING_ENDPOINT`,
        500,
        { options, elasticacheConfig }
      );
    }
    const redisClient = new Redis.Cluster(
      [
        {
          host: clusterEndpoint,
          port: clusterPort,
        },
      ],
      {
        dnsLookup: (address, callback) => callback(null, address),
        redisOptions: {
          tls: {},
        },
      }
    );
    redisClient.on('error', err => {
      logger.error(`${FILE}::REDIS_CLIENT_NOT_CONNECTED_ERROR`, { err });
    });
    redisClient.on('connect', () => {
      logger.debug(`${FILE}::REDIS_CLIENT_CONNECTED`);
    });
    try {
      yield redisClient.connect();
    } catch (error) {
      // Not ideal to base on error message but ioredis doesn't have a better way to check if it's already connected
      if (error.message === 'Redis is already connecting/connected') {
        logger.debug(`${FILE}::REDIS_ALREADY_CONNECTED`, {
          error,
          errorMessage:
            error === null || error === void 0 ? void 0 : error.message,
          clusterEndpoint,
          clusterPort,
        });
      } else {
        throw new LesgoException(
          'Failed to connect to ElastiCache Redis',
          `${FILE}::REDIS_CONNECT_ERROR`,
          500,
          {
            error,
            errorMessage:
              error === null || error === void 0 ? void 0 : error.message,
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
