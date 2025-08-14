import { Cluster, ClusterOptions } from 'ioredis';
import { ClientOptions } from '../../types/aws';
export interface Singleton {
    [key: string]: Cluster;
}
export declare const singleton: Singleton;
export interface ElastiCacheRedisClientOptions extends ClientOptions {
    endpoint?: string;
    port?: number;
    clusterOptions?: ClusterOptions;
}
declare const getElastiCacheRedisClient: (clientOpts?: ElastiCacheRedisClientOptions) => Promise<Cluster>;
export default getElastiCacheRedisClient;
