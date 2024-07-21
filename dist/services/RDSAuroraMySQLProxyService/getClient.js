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
import mysql from 'mysql2/promise';
import logger from '../../utils/logger';
import isEmpty from '../../utils/isEmpty';
import rdsConfig from '../../config/rds';
import { getSecretValue } from '../../utils/secretsmanager';
const FILE = 'lesgo.services.RDSAuroraMySQLProxyService.getClient';
const singleton = {};
const getClient = opts =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!isEmpty(singleton[opts.singletonConn])) {
      logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
        client: singleton[opts.singletonConn],
        region: opts.region,
      });
      return singleton[opts.singletonConn];
    }
    const dbCredentials = yield getSecretValue(
      opts.dbCredentialsSecretId
        ? opts.dbCredentialsSecretId
        : rdsConfig.aurora.mysql.proxy.dbCredentialsSecretId,
      {
        region: opts.region,
        singletonConn: opts.singletonConn,
      }
    );
    const pool = mysql.createPool({
      host: dbCredentials.host,
      user: dbCredentials.username,
      password: dbCredentials.password,
      database:
        (_a = opts.databaseName) !== null && _a !== void 0
          ? _a
          : rdsConfig.aurora.mysql.databaseName,
    });
    singleton[opts.singletonConn] = pool;
    logger.debug(`${FILE}::NEW_CLIENT_SINGLETON`, {
      opts,
    });
    return pool;
  });
export default getClient;
