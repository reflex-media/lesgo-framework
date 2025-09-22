import { ClusterOptions } from 'ioredis';
export interface ClientOptions {
  region?: string;
  singletonConn?: string;
}
export interface ElastiCacheRedisClientOptions extends ClientOptions {
  region?: string;
  singletonConn?: string;
  clusterOptions?: ClusterOptions;
}

export interface RDSAuroraMySQLProxyClientOptions extends ClientOptions {
  dbCredentialsSecretId?: string;
  databaseName?: string;
}
