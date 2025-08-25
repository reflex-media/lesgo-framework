import {
  Pool,
  Connection,
  ConnectionOptions,
  createPool,
  createConnection,
} from 'mysql2/promise';
import { logger, isEmpty, validateFields } from '../../utils';
import { rds as rdsConfig } from '../../config';
import { getSecretValue } from '../../utils/secretsmanager';
import { RDSAuroraMySQLProxyClientOptions } from '../../types/aws';

const FILE = 'lesgo.services.RDSAuroraMySQLProxyService.getMySQLProxyClient';

export interface Singleton {
  [key: string]: Pool | Connection;
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
    { key: 'usePool', type: 'boolean', required: false },
  ]);

  const region = options.region || rdsConfig.aurora.mysql.region;
  const singletonConn = options.singletonConn || 'default';
  const dbCredentialsSecretId = (options.dbCredentialsSecretId ||
    rdsConfig.aurora.mysql.proxy.dbCredentialsSecretId) as string;
  const databaseName =
    options.databaseName || rdsConfig.aurora.mysql.databaseName;
  const usePool = options.usePool ?? rdsConfig.aurora.mysql.proxy.usePool;

  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_RDS_CONNECTION`);
    return singleton[singletonConn];
  }

  const dbCredentials = await getSecretValue(dbCredentialsSecretId, undefined, {
    region,
    singletonConn,
  });

  const poolOptions = {
    connectionLimit: rdsConfig.aurora.mysql.proxy.connectionLimit || 10,
    waitForConnections: rdsConfig.aurora.mysql.proxy.waitForConnections || true,
    queueLimit: rdsConfig.aurora.mysql.proxy.queueLimit || 0,
  };

  const connOpts = {
    host: rdsConfig.aurora.mysql.proxy.host || dbCredentials.host,
    database: databaseName,
    port: rdsConfig.aurora.mysql.proxy.port || dbCredentials.port || 3306,
    ...(usePool ? poolOptions : {}),
    ...connOptions,
  };
  logger.debug(`${FILE}::CONN_OPTS`, { connOpts });

  const dbPool = usePool
    ? createPool({
        user: dbCredentials.username,
        password: dbCredentials.password,
        ...connOpts,
      })
    : await createConnection({
        user: dbCredentials.username,
        password: dbCredentials.password,
        ...connOpts,
      });

  singleton[singletonConn] = dbPool;
  logger.debug(`${FILE}::NEW_RDS_CONNECTION`);

  return dbPool;
};

export default getMySQLProxyClient;
