import disconnectElastiCacheRedisClient from './disconnectElastiCacheRedisClient';
import getElastiCacheRedisClient from './getElastiCacheRedisClient';
import getRedisCache from './getRedisCache';
import setRedisCache from './setRedisCache';
export { disconnectElastiCacheRedisClient, getElastiCacheRedisClient, setRedisCache, getRedisCache, };
declare const _default: {
    disconnectElastiCacheRedisClient: () => Promise<void>;
    getElastiCacheRedisClient: (clientOpts?: import("./getElastiCacheRedisClient").ElastiCacheRedisClientOptions | undefined) => Promise<import("ioredis/built/cluster").default>;
    setRedisCache: (key: string, value: any, opts?: import("./setRedisCache").SetRedisCacheOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<"OK">;
    getRedisCache: (key: string, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<string | null>;
};
export default _default;
