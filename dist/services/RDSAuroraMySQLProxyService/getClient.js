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
import awsConfig from '../../config/aws';
import { getSecretValue } from '../../utils/secretsmanager';
const FILE = 'lesgo.services.RDSAuroraMySQLProxyService.getClient';
const singleton = {};
const getClient = ({
  dbCredentialsSecretId,
  databaseName,
  singletonConn,
  region,
}) =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (!isEmpty(singleton[singletonConn])) {
      logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
        client: singleton[singletonConn],
        region,
      });
      return singleton[singletonConn];
    }
    const dbCredentials = yield getSecretValue(
      dbCredentialsSecretId
        ? dbCredentialsSecretId
        : awsConfig.rds.aurora.mysql.databaseCredentialsSecretsManagerId,
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
  });
export default getClient;
