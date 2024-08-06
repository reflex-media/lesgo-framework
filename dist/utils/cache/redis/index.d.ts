import deleteCache from './deleteCache';
import getCache from './getCache';
import getClient from './getClient';
import setCache from './setCache';
export { deleteCache, getCache, getClient, setCache };
declare const _default: {
    deleteCache: (key: string, clientOpts?: import("../../../types/aws").ClientOptions | undefined) => Promise<number>;
    getCache: (key: string, clientOpts?: import("../../../types/aws").ClientOptions | undefined) => Promise<any>;
    getClient: (clientOpts?: import("../../../types/aws").ClientOptions | undefined) => Promise<import("ioredis/built/cluster").default>;
    setCache: (key: string, value: any, opts?: import("../../../services/ElastiCacheRedisService/setRedisCache").SetRedisCacheOptions | undefined, clientOpts?: import("../../../types/aws").ClientOptions | undefined) => Promise<"OK">;
};
export default _default;
