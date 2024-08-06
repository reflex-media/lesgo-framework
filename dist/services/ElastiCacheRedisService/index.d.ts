import getElastiCacheRedisClient from './getElastiCacheRedisClient';
import getRedisCache from './getRedisCache';
import setRedisCache from './setRedisCache';
export { getElastiCacheRedisClient, setRedisCache, getRedisCache };
declare const _default: {
    getElastiCacheRedisClient: (clientOpts?: import("./getElastiCacheRedisClient").ElastiCacheRedisClientOptions | undefined) => Promise<import("ioredis/built/cluster").default>;
    setRedisCache: (key: string, value: any, opts?: import("./setRedisCache").SetRedisCacheOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<"OK">;
    getRedisCache: (key: string, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<string | null>;
};
export default _default;
