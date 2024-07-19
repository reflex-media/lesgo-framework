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
import { logger, validateFields } from '../../utils';
import { LesgoException } from '../../exceptions';
import getClient from './getClient';
const FILE = 'lesgo.services.RDSAuroraMySQLService.query';
const query = (sql, opts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const input = validateFields({ query }, [
      {
        key: 'sql',
        type: 'string',
        required: true,
      },
    ]);
    const { client, params } = yield getClient(opts);
    const sqlParams = Object.assign(Object.assign({}, params), {
      sql: input.sql,
    });
    try {
      const result = yield client.executeStatement(sqlParams).promise();
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, result);
      return result;
    } catch (err) {
      throw new LesgoException('Failed to query', `${FILE}::QUERY_ERROR`, 500, {
        err,
        sql,
        opts,
      });
    }
  });
export default query;
