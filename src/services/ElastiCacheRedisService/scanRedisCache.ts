import { logger, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
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
const scanRedisCache = async (pattern: string, clientOpts?: ClientOptions) => {
  const input = validateFields({ pattern }, [
    { key: 'pattern', type: 'string', required: true },
  ]);

  const client = await getElastiCacheRedisClient(clientOpts);
  const allKeys: string[] = [];

  try {
    const masterNodes = client.nodes('master');

    for (const node of masterNodes) {
      let cursor = '0';

      do {
        const [newCursor, keys] = await node.scan(
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
};

export default scanRedisCache;
