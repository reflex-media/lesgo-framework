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
import { logger } from '../../utils';
import { LesgoException } from '../../exceptions';
import getElastiCacheRedisClient from './getElastiCacheRedisClient';
const FILE = 'lesgo.services.ElastiCacheRedis.deleteRedisCache';
const deleteRedisCache = (keys, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getElastiCacheRedisClient(clientOpts);
    if (!Array.isArray(keys)) {
      keys = [keys];
    }
    try {
      if (keys.length > 0) {
        for (const key of keys) {
          // Keys to be deleted individually due to using Redis Cluster and key may exist across different nodes
          // ioredis handles the routing of the key to the correct node automatically
          const resp = yield client.del(key);
          logger.debug(`${FILE}::CACHE_KEY_DELETED`, { resp, key });
        }
      }
      logger.debug(`${FILE}::ALL_KEYS_DELETED`, { keys });
    } catch (err) {
      throw new LesgoException(
        'Failed to delete redis cache',
        `${FILE}::DELETE_ERROR`,
        500,
        {
          err,
          keys,
          clientOpts,
        }
      );
    }
  });
export default deleteRedisCache;
