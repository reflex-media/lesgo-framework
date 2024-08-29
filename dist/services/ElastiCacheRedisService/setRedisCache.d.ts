import { ClientOptions } from '../../types/aws';
export interface SetRedisCacheOptions {
    EX?: number;
}
/**
 * Sets a value in Redis cache.
 *
 * @param key - The key to set in the cache.
 * @param value - The value to set in the cache.
 * @param opts - Optional settings for cache expiration and other options.
 * @param clientOpts - Optional settings for the Redis client.
 * @returns A Promise that resolves to the response from Redis.
 * @throws {LesgoException} If there is an error setting the cache.
 */
declare const setRedisCache: (key: string, value: any, opts?: SetRedisCacheOptions, clientOpts?: ClientOptions) => Promise<"OK">;
export default setRedisCache;
