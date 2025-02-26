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
import { rds as rdsConfig } from '../../config';
import { getSecretValue } from '../../utils/secretsmanager';
const FILE = 'lesgo.services.RDSAuroraMySQLProxyService.getMySQLProxyClient';
export const singleton = {};
const getMySQLProxyClient = (connOptions, clientOpts) =>
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
    if (!isEmpty(singleton[singletonConn])) {
      logger.debug(`${FILE}::REUSE_RDS_CONNECTION`);
      return singleton[singletonConn];
    }
    const dbCredentials = yield getSecretValue(
      dbCredentialsSecretId,
      undefined,
      {
        region,
        singletonConn,
      }
    );
    const connOpts = Object.assign(
      {
        host: rdsConfig.aurora.mysql.proxy.host || dbCredentials.host,
        database: databaseName,
        port: rdsConfig.aurora.mysql.proxy.port || dbCredentials.port || 3306,
        connectionLimit: rdsConfig.aurora.mysql.proxy.connectionLimit || 10,
        waitForConnections:
          rdsConfig.aurora.mysql.proxy.waitForConnections || true,
        queueLimit: rdsConfig.aurora.mysql.proxy.queueLimit || 0,
      },
      connOptions
    );
    logger.debug(`${FILE}::CONN_OPTS`, { connOpts });
    const dbPool = createPool(
      Object.assign(
        { user: dbCredentials.username, password: dbCredentials.password },
        connOpts
      )
    );
    singleton[singletonConn] = dbPool;
    logger.debug(`${FILE}::NEW_RDS_CONNECTION`);
    return dbPool;
  });
export default getMySQLProxyClient;
