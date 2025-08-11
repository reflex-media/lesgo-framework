var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { createPool } from 'mysql2/promise';
import { logger, isEmpty, validateFields } from '../../utils';
import { getSecretValue } from '../../utils/secretsmanager';
import { rds as rdsConfig } from '../../config';
const FILE = 'lesgo.services.RDSAuroraMySQLProxyService.getMySQLProxyClient';
export const singleton = {};
// Used to avoid running multiple health checks or pool creations at the same time for the same connection
const poolHealthCheckLocks = {};
const poolRecreationCounts = {};
const MAX_POOL_CREATION_RETRIES = 3;
const isPoolHealthy = pool =>
  __awaiter(void 0, void 0, void 0, function* () {
    let conn;
    try {
      conn = yield pool.getConnection();
      yield conn.ping();
      return true;
    } catch (err) {
      logger.warn(`${FILE}::POOL_PING_FAILED`, {
        error: { trace: err },
      });
      return false;
    } finally {
      if (conn) conn.release();
    }
  });
const createAndStoreNewPool = (
  singletonConn,
  connOptions,
  dbCredentialsSecretId,
  region,
  databaseName
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    for (let attempt = 1; attempt <= MAX_POOL_CREATION_RETRIES; attempt++) {
      try {
        const dbCredentials = dbCredentialsSecretId
          ? yield getSecretValue(dbCredentialsSecretId, undefined, {
              region,
              singletonConn,
            })
          : {};
        const connOpts = Object.assign(
          {
            host:
              rdsConfig.aurora.mysql.proxy.host ||
              (dbCredentials === null || dbCredentials === void 0
                ? void 0
                : dbCredentials.host),
            database: databaseName,
            port:
              rdsConfig.aurora.mysql.proxy.port ||
              (dbCredentials === null || dbCredentials === void 0
                ? void 0
                : dbCredentials.port) ||
              3306,
            connectionLimit: rdsConfig.aurora.mysql.proxy.connectionLimit || 10,
            waitForConnections:
              (_a = rdsConfig.aurora.mysql.proxy.waitForConnections) !== null &&
              _a !== void 0
                ? _a
                : true,
            queueLimit: rdsConfig.aurora.mysql.proxy.queueLimit || 0,
            user: rdsConfig.aurora.mysql.user || dbCredentials.username,
            password: rdsConfig.aurora.mysql.password || dbCredentials.password,
          },
          connOptions
        );
        logger.debug(`${FILE}::CONN_OPTS`, { connOpts });
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
        if (attempt === MAX_POOL_CREATION_RETRIES) {
          throw new Error(
            `Failed to create MySQL pool after ${MAX_POOL_CREATION_RETRIES} attempts`
          );
        }
      }
    }
    // Should not reach
    throw new Error(`${FILE}::UNEXPECTED_POOL_CREATION_FAILURE`);
  });
const getClient = (connOptions, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
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
    if (!databaseName) {
      throw new Error(`${FILE}::DATABASE_NAME_NOT_PROVIDED`);
    }
    if (!isEmpty(singleton[singletonConn])) {
      if (!poolHealthCheckLocks[singletonConn]) {
        poolHealthCheckLocks[singletonConn] = (() =>
          __awaiter(void 0, void 0, void 0, function* () {
            try {
              const healthy = yield isPoolHealthy(singleton[singletonConn]);
              if (healthy) {
                logger.debug(`${FILE}::REUSE_RDS_CONNECTION`);
                return singleton[singletonConn];
              }
              logger.warn(`${FILE}::POOL_UNHEALTHY_RECONNECTING`);
              try {
                yield singleton[singletonConn].end();
              } catch (endErr) {
                logger.warn(`${FILE}::POOL_END_FAILED`, {
                  error: { trace: endErr },
                });
              }
              delete singleton[singletonConn];
              return yield createAndStoreNewPool(
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
          }))();
      } else {
        logger.debug(`${FILE}::REUSE_RDS_CONNECTION (from lock)`);
      }
      const result = yield poolHealthCheckLocks[singletonConn];
      if (!result) {
        throw new Error(`${FILE}::Pool health check lock failed unexpectedly`);
      }
      return result;
    }
    return yield createAndStoreNewPool(
      singletonConn,
      connOptions,
      dbCredentialsSecretId,
      region,
      databaseName
    );
  });
export default getClient;
