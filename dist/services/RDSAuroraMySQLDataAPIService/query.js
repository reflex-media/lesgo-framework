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
import { ExecuteStatementCommand } from '@aws-sdk/client-rds-data';
import { logger, validateFields } from '../../utils';
import { LesgoException } from '../../exceptions';
import getClient from './getClient';
const FILE = 'lesgo.services.RDSAuroraMySQLService.query';
const query = (sql, opts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const input = validateFields(Object.assign({ sql }, opts), [
      { key: 'sql', type: 'string', required: true },
      { key: 'secretArn', type: 'string', required: false },
      { key: 'resourceArn', type: 'string', required: false },
      { key: 'databaseName', type: 'string', required: false },
      { key: 'maxAttempts', type: 'number', required: false },
      { key: 'requestTimeout', type: 'number', required: false },
      { key: 'singletonConn', type: 'string', required: true },
      { key: 'region', type: 'string', required: true },
    ]);
    const { client, params } = yield getClient(opts);
    const sqlParams = Object.assign(Object.assign({}, params), {
      secretArn:
        (_a = input.secretArn) !== null && _a !== void 0
          ? _a
          : params.secretArn,
      resourceArn:
        (_b = input.resourceArn) !== null && _b !== void 0
          ? _b
          : params.resourceArn,
      database:
        (_c = input.databaseName) !== null && _c !== void 0
          ? _c
          : params.database,
      maxAttempts:
        (_d = input.maxAttempts) !== null && _d !== void 0
          ? _d
          : params.maxAttempts,
      requestTimeout:
        (_e = input.requestTimeout) !== null && _e !== void 0
          ? _e
          : params.requestTimeout,
      sql: input.sql,
    });
    const command = new ExecuteStatementCommand(sqlParams);
    logger.debug(`${FILE}::BUILDING_COMMAND`, { sqlParams, command });
    try {
      const result = yield client.send(command);
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { result, sqlParams });
      return result;
    } catch (err) {
      throw new LesgoException('Failed to query', `${FILE}::QUERY_ERROR`, 500, {
        err,
        sqlParams,
        opts,
      });
    }
  });
export default query;
