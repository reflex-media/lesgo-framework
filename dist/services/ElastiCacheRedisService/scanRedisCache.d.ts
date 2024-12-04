import { ClientOptions } from '../../types/aws';
/**
 * Scans the Redis cache for keys matching a given pattern.
 *
 * @param {string} pattern - The pattern to match keys against.
 * @param {ClientOptions} [clientOpts] - Optional client options for connecting to the Redis instance.
 * @returns {Promise<string[]>} - A promise that resolves to an array of keys matching the pattern.
 *
 * @throws {LesgoException} - Throws an exception if the scan operation fails.
 */
declare const scanRedisCache: (pattern: string, clientOpts?: ClientOptions) => Promise<string[]>;
export default scanRedisCache;
