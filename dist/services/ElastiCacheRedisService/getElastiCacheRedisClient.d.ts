import { Cluster } from 'ioredis';
import { ClientOptions } from '../../types/aws';
export interface Singleton {
    [key: string]: Cluster;
}
export interface ElastiCacheRedisClientOptions extends ClientOptions {
    clusterId?: string;
    secretId?: string;
}
declare const getElastiCacheRedisClient: (clientOpts?: ElastiCacheRedisClientOptions) => Promise<Cluster>;
export default getElastiCacheRedisClient;
