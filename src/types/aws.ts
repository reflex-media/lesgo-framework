import type { RetryStrategy } from '@aws-sdk/types';

export interface ClientOptions {
  region?: string;
  singletonConn?: string;
}

export interface RDSAuroraMySQLProxyClientOptions extends ClientOptions {
  dbCredentialsSecretId?: string;
  databaseName?: string;
}

export interface DynamoDbClientOptions extends ClientOptions {
  retryStrategy?: RetryStrategy;
}
