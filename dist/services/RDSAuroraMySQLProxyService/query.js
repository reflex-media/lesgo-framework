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
const query = (sql, preparedValues, connOptions, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const input = validateFields({ sql, preparedValues }, [
      { key: 'sql', type: 'string', required: true },
      { key: 'preparedValues', type: 'array', required: false },
    ]);
    const connection = yield getClient(connOptions, clientOpts);
    try {
      const resp = yield connection.execute(input.sql, input.preparedValues);
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { resp, sql, preparedValues });
      return resp;
    } catch (err) {
      throw new LesgoException('Failed to query', `${FILE}::QUERY_ERROR`, 500, {
        err,
        sql,
        preparedValues,
        connOptions,
        clientOpts,
      });
    }
  });
export default query;
