export interface ClientOptions {
  region?: string;
  singletonConn?: string;
}

export interface RDSAuroraMySQLProxyClientOptions extends ClientOptions {
  dbCredentialsSecretId?: string;
  databaseName?: string;
  usePool?: boolean;
}
