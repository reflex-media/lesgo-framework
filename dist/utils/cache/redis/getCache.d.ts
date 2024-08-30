import { ClientOptions } from '../../../types/aws';
/**
 * Retrieves the value from the cache based on the provided key.
 *
 * @param {string} key - The key used to identify the value in the cache.
 * @param {ClientOptions} clientOpts - Optional client options for the cache client.
 * @returns A promise that resolves when the value is retrieved from the cache.
 *
 * @throws {LesgoException} If there is an error retrieving the cache.
 *
 * @example
 * ```typescript
 * import { getCache } from 'lesgo/utils/cache/redis';
 *
 * const key = 'myKey';
 *
 * const value = await getCache(key);
 * console.log(value); // Value retrieved from the cache
 * ```
 */
declare const getCache: (key: string, clientOpts?: ClientOptions) => Promise<any>;
export default getCache;
