import { Pool, ConnectionOptions, createPool } from 'mysql2/promise';
import { logger, isEmpty, validateFields } from '../../utils';
import { getSecretValue } from '../../utils/secretsmanager';
import { RDSAuroraMySQLProxyClientOptions } from '../../types/aws';
import { rds as rdsConfig } from '../../config';

const FILE = 'lesgo.services.RDSAuroraMySQLProxyService.getMySQLProxyClient';

export interface Singleton {
  [key: string]: Pool;
}

export const singleton: Singleton = {};

// Used to avoid running multiple health checks or pool creations at the same time for the same connection
const poolHealthCheckLocks: Record<string, Promise<Pool> | null> = {};

const poolRecreationCounts: Record<string, number> = {};

const MAX_POOL_CREATION_RETRIES = rdsConfig.aurora.mysql.maxPoolCreationRetries;

// small helper to pause between retries
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isPoolHealthy = async (pool: Pool): Promise<boolean> => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.ping();
    return true;
  } catch (err) {
    logger.warn(`${FILE}::POOL_PING_FAILED`, {
      error: { trace: err },
    });
    return false;
  } finally {
    if (conn) conn.release();
  }
};

const createAndStoreNewPool = async (
  singletonConn: string,
  connOptions: ConnectionOptions | undefined,
  dbCredentialsSecretId: string | undefined,
  region: string,
  databaseName: string
): Promise<Pool> => {
  const dbCredentials = dbCredentialsSecretId
    ? await getSecretValue(dbCredentialsSecretId, undefined, {
        region,
        singletonConn,
      })
    : {};

  for (let attempt = 1; attempt <= MAX_POOL_CREATION_RETRIES; attempt++) {
    try {
      const connOpts = {
        host: rdsConfig.aurora.mysql.proxy.host || dbCredentials?.host,
        database: databaseName,
        port:
          Number(rdsConfig.aurora.mysql.proxy.port || dbCredentials?.port) ||
          3306,
        connectionLimit:
          Number(rdsConfig.aurora.mysql.proxy.connectionLimit) || 10,
        waitForConnections:
          rdsConfig.aurora.mysql.proxy.waitForConnections ?? true,
        queueLimit: Number(rdsConfig.aurora.mysql.proxy.queueLimit) || 0,
        user: rdsConfig.aurora.mysql.user,
        password: rdsConfig.aurora.mysql.password,
        ...connOptions,
      };

      logger.debug(`${FILE}::CONN_OPTS`, { connOpts, connOptions });

      const dbPool = createPool(connOpts);

      singleton[singletonConn] = dbPool;
      poolRecreationCounts[singletonConn] =
        (poolRecreationCounts[singletonConn] || 0) + 1;

      logger.debug(`${FILE}::NEW_RDS_CONNECTION`, {
        attempt,
        recreatedCount: poolRecreationCounts[singletonConn],
      });

      return dbPool;
    } catch (err) {
      logger.warn(`${FILE}::POOL_CREATION_RETRY_FAILED`, {
        attempt,
        error: { trace: err },
      });

      // short exponential backoff before retrying
      if (attempt <= MAX_POOL_CREATION_RETRIES) {
        const delay = Math.min(1000, 100 * 2 ** (attempt - 1));
        logger.debug(`${FILE}::POOL_CREATION_BACKOFF`, { attempt, delay });
        await sleep(delay);
      } else {
        throw new Error(
          `Failed to create MySQL pool after ${MAX_POOL_CREATION_RETRIES} attempts`
        );
      }
    }
  }

  // Should not reach
  throw new Error(`${FILE}::UNEXPECTED_POOL_CREATION_FAILURE`);
};

const getClient = async (
  connOptions?: ConnectionOptions,
  clientOpts?: RDSAuroraMySQLProxyClientOptions
): Promise<Pool> => {
  const options = validateFields(clientOpts || {}, [
    { key: 'region', type: 'string', required: false },
    { key: 'singletonConn', type: 'string', required: false },
    { key: 'dbCredentialsSecretId', type: 'string', required: false },
    { key: 'databaseName', type: 'string', required: false },
  ]);

  logger.debug(`${FILE}::GET_CLIENT_OPTIONS`, {
    connOptions,
    clientOpts,
    options,
  });

  const region = options.region || rdsConfig.aurora.mysql.region;
  const singletonConn = options.singletonConn || 'default';
  const dbCredentialsSecretId =
    options.dbCredentialsSecretId ||
    rdsConfig.aurora.mysql.proxy.dbCredentialsSecretId;
  const databaseName =
    options.databaseName || rdsConfig.aurora.mysql.databaseName;

  if (!databaseName) {
    throw new Error(`${FILE}::DATABASE_NAME_NOT_PROVIDED`);
  }

  if (!isEmpty(singleton[singletonConn])) {
    if (!poolHealthCheckLocks[singletonConn]) {
      poolHealthCheckLocks[singletonConn] = (async () => {
        try {
          const healthy = await isPoolHealthy(singleton[singletonConn]);
          if (healthy) {
            logger.debug(`${FILE}::REUSE_RDS_CONNECTION`);
            return singleton[singletonConn];
          }

          logger.warn(`${FILE}::POOL_UNHEALTHY_RECONNECTING`);
          try {
            await singleton[singletonConn].end();
          } catch (endErr) {
            logger.warn(`${FILE}::POOL_END_FAILED`, {
              error: { trace: endErr },
            });
          }

          delete singleton[singletonConn];
          return await createAndStoreNewPool(
            singletonConn,
            connOptions,
            dbCredentialsSecretId,
            region,
            databaseName
          );
        } finally {
          // Ensure we always clean up the lock regardless of success/failure
          poolHealthCheckLocks[singletonConn] = null;
        }
      })();
    } else {
      logger.debug(`${FILE}::REUSE_RDS_CONNECTION (from lock)`);
    }

    const result = await poolHealthCheckLocks[singletonConn];

    if (!result) {
      throw new Error(`${FILE}::Pool health check lock failed unexpectedly`);
    }
    return result;
  }

  return await createAndStoreNewPool(
    singletonConn,
    connOptions,
    dbCredentialsSecretId,
    region,
    databaseName
  );
};

export default getClient;
