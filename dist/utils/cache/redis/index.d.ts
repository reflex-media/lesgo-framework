import getCache from './getCache';
import getClient from './getClient';
import setCache from './setCache';
export { getCache, getClient, setCache };
declare const _default: {
    getCache: (key: string, clientOpts?: import("../../../types/aws").RDSAuroraMySQLProxyClientOptions | undefined) => Promise<any>;
    getClient: (clientOpts?: import("../../../types/aws").ClientOptions | undefined) => Promise<import("ioredis/built/cluster").default>;
    setCache: (key: string, value: any, opts?: import("../../../services/ElastiCacheRedisService/setRedisCache").SetRedisCacheOptions | undefined, clientOpts?: import("../../../types/aws").RDSAuroraMySQLProxyClientOptions | undefined) => Promise<"OK">;
};
export default _default;
