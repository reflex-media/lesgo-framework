import {
  createConnection,
  Connection,
  ConnectionOptions,
} from 'mysql2/promise';
import { logger, isEmpty, validateFields } from '../../utils';
import { rds as rdsConfig } from '../../config';
import { getSecretValue } from '../../utils/secretsmanager';
import { RDSAuroraMySQLProxyClientOptions } from '../../types/aws';

const FILE = 'lesgo.services.RDSAuroraMySQLProxyService.getMySQLProxyClient';

export interface Singleton {
  [key: string]: Connection;
}

export const singleton: Singleton = {};

const getMySQLProxyClient = async (
  connOptions?: ConnectionOptions,
  clientOpts?: RDSAuroraMySQLProxyClientOptions
) => {
  const options = validateFields(clientOpts || {}, [
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
    logger.debug(`${FILE}::REUSE_RDS_CONNECTION`, {
      client: singleton[singletonConn],
      region,
    });

    return singleton[singletonConn];
  }

  const dbCredentials = await getSecretValue(dbCredentialsSecretId, undefined, {
    region,
    singletonConn,
  });

  const validatedDbCredentials = validateFields(dbCredentials, [
    { key: 'host', type: 'string', required: true },
    { key: 'username', type: 'string', required: true },
    { key: 'password', type: 'string', required: true },
  ]);

  const connOpts = {
    host: rdsConfig.aurora.mysql.proxy.host || validatedDbCredentials.host,
    database: databaseName,
    ...connOptions,
  };
  logger.debug(`${FILE}::CONN_OPTS`, { connOpts });

  const conn = await createConnection({
    user: validatedDbCredentials.username,
    password: validatedDbCredentials.password,
    ...connOpts,
  });

  singleton[singletonConn] = conn;
  logger.debug(`${FILE}::NEW_RDS_CONNECTION`);

  return conn;
};

export default getMySQLProxyClient;
