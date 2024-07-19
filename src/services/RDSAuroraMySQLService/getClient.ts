import mysql from 'mysql2/promise';
import logger from '../../utils/logger';
import isEmpty from '../../utils/isEmpty';

const FILE = 'lesgo.services.RDSAuroraMySQLService.getClient';

export interface Singleton {
  [key: string]: mysql.PoolConnection;
}

export interface GetClientOptions {
  region: string;
  singletonConn: string;
}

const singleton: Singleton = {};

const getConnection = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'test',
  });

  const pool = mysql.createPool({
    host: 'your-proxy-endpoint',
    user: 'your-username',
    password: 'your-password',
    database: 'your-database',
  });
};

const getClient = async ({ singletonConn, region }: GetClientOptions) => {
  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
      client: singleton[singletonConn],
      region,
    });

    return singleton[singletonConn];
  }

  const pool = mysql.createPool({
    host: 'your-proxy-endpoint',
    user: 'your-username',
    password: 'your-password',
    database: 'your-database',
  });

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'test',
  });

  const client = await pool.getConnection();

  logger.debug(`${FILE}::NEW_CLIENT_SINGLETON`, {
    client,
    region,
  });

  singleton[singletonConn] = client;

  return client;
};

export default getClient;
