import mysql from 'mysql2/promise';
import logger from '../../utils/logger';
import isEmpty from '../../utils/isEmpty';
import rdsConfig from '../../config/rds';
import { getSecretValue } from '../../utils/secretsmanager';

const FILE = 'lesgo.services.RDSAuroraMySQLProxyService.getClient';

export interface Singleton {
  [key: string]: mysql.Pool;
}

export interface GetClientOptions {
  dbCredentialsSecretId?: string;
  databaseName?: string;
  region: string;
  singletonConn: string;
}

const singleton: Singleton = {};

const getClient = async (opts: GetClientOptions) => {
  if (!isEmpty(singleton[opts.singletonConn])) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
      client: singleton[opts.singletonConn],
      region: opts.region,
    });

    return singleton[opts.singletonConn];
  }

  const dbCredentials = await getSecretValue(
    opts.dbCredentialsSecretId
      ? opts.dbCredentialsSecretId
      : rdsConfig.aurora.mysql.proxy.dbCredentialsSecretId!,
    {
      region: opts.region,
      singletonConn: opts.singletonConn,
    }
  );

  const pool = mysql.createPool({
    host: dbCredentials.host,
    user: dbCredentials.username,
    password: dbCredentials.password,
    database: opts.databaseName ?? rdsConfig.aurora.mysql.databaseName,
  });

  singleton[opts.singletonConn] = pool;
  logger.debug(`${FILE}::NEW_CLIENT_SINGLETON`, {
    opts,
  });

  return pool;
};

export default getClient;
