import mysql from 'mysql2/promise';
import logger from '../../utils/logger';
import isEmpty from '../../utils/isEmpty';
import awsConfig from '../../config/aws';
import { getSecretValue } from '../../utils/secretsmanager';

const FILE = 'lesgo.services.RDSAuroraMySQLProxyService.getClient';

export interface Singleton {
  [key: string]: mysql.Pool;
}

export interface GetClientOptions {
  dbCredentialsSecretId?: string;
  databaseName?: string;
  connectionType?: string;
  region: string;
  singletonConn: string;
}

const singleton: Singleton = {};

const getClient = async ({
  dbCredentialsSecretId,
  databaseName,
  singletonConn,
  region,
}: GetClientOptions) => {
  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
      client: singleton[singletonConn],
      region,
    });

    return singleton[singletonConn];
  }

  const dbCredentials = await getSecretValue(
    dbCredentialsSecretId
      ? dbCredentialsSecretId
      : awsConfig.rds.aurora.mysql.databaseCredentialsSecretsManagerId!,
    {
      region,
      singletonConn,
    }
  );

  const pool = mysql.createPool({
    host: dbCredentials.host,
    user: dbCredentials.username,
    password: dbCredentials.password,
    database: databaseName
      ? databaseName
      : awsConfig.rds.aurora.mysql.databaseName,
  });

  singleton[singletonConn] = pool;
  logger.debug(`${FILE}::NEW_CLIENT_SINGLETON`, {
    singletonConn,
    region,
  });

  return pool;
};

export default getClient;
