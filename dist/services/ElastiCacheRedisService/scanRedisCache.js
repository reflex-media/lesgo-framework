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
import { logger, validateFields } from '../../utils';
import { LesgoException } from '../../exceptions';
import getElastiCacheRedisClient from './getElastiCacheRedisClient';
const FILE = 'lesgo.services.ElastiCacheRedis.scanRedisCache';
/**
 * Scans the Redis cache for keys matching a given pattern.
 *
 * @param {string} pattern - The pattern to match keys against.
 * @param {ClientOptions} [clientOpts] - Optional client options for connecting to the Redis instance.
 * @returns {Promise<string[]>} - A promise that resolves to an array of keys matching the pattern.
 *
 * @throws {LesgoException} - Throws an exception if the scan operation fails.
 */
const scanRedisCache = (pattern, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const input = validateFields({ pattern }, [
      { key: 'pattern', type: 'string', required: true },
    ]);
    const client = yield getElastiCacheRedisClient(clientOpts);
    const allKeys = [];
    try {
      const masterNodes = client.nodes('master');
      for (const node of masterNodes) {
        let cursor = '0';
        do {
          const [newCursor, keys] = yield node.scan(
            cursor,
            'MATCH',
            pattern,
            'COUNT',
            100
          );
          cursor = newCursor;
          if (keys.length > 0) {
            allKeys.push(...keys);
          }
        } while (cursor !== '0');
      }
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { allKeys, input });
    } catch (err) {
      throw new LesgoException(
        'Failed to scan redis cache',
        `${FILE}::SCAN_ERROR`,
        500,
        {
          err,
          input,
          clientOpts,
        }
      );
    }
    return allKeys;
  });
export default scanRedisCache;
