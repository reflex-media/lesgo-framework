import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import { logger, isEmpty, validateFields } from '../../utils';
import rdsConfig from '../../config/rds';
import { getSecretValue } from '../../utils/secretsmanager';
import { RDSAuroraMySQLProxyClientOptions } from '../../types/aws';

const FILE = 'lesgo.services.RDSAuroraMySQLProxyService.getClient';

export interface Singleton {
  [key: string]: Pool;
}

const singleton: Singleton = {};

const getClient = async (
  poolOpts?: PoolOptions,
  clientOpts: RDSAuroraMySQLProxyClientOptions = {}
) => {
  const options = validateFields(clientOpts, [
    { key: 'region', type: 'string', required: false },
    { key: 'singletonConn', type: 'string', required: false },
    { key: 'dbCredentialsSecretId', type: 'string', required: false },
    { key: 'databaseName', type: 'string', required: false },
  ]);

  const region = options.region || rdsConfig.aurora.mysql.region;
  const singletonConn = options.singletonConn || 'default';
  const dbCredentialsSecretId =
    options.dbCredentialsSecretId ||
    rdsConfig.aurora.mysql.proxy.dbCredentialsSecretId;
  const databaseName =
    options.databaseName || rdsConfig.aurora.mysql.databaseName;

  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
      client: singleton[singletonConn],
      region,
    });

    return singleton[singletonConn];
  }

  const dbCredentials = await getSecretValue(dbCredentialsSecretId, undefined, {
    region,
    singletonConn,
  });

  const pool = mysql.createPool({
    ...poolOpts,
    host: dbCredentials.host,
    user: dbCredentials.username,
    password: dbCredentials.password,
    database: databaseName,
  });

  singleton[singletonConn] = pool;
  logger.debug(`${FILE}::NEW_CLIENT_SINGLETON`, {
    client: pool,
  });

  return pool;
};

export default getClient;
