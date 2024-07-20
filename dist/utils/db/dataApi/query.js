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
import isEmpty from '../../../utils/isEmpty';
import queryService from '../../../services/RDSAuroraMySQLDataAPIService/query';
import validateFields from '../../validateFields';
import config from '../../../config/aws';
const query = (sql, opts = {}) =>
  __awaiter(void 0, void 0, void 0, function* () {
    opts = Object.assign(Object.assign({}, opts), {
      singletonConn: !isEmpty(opts.singletonConn)
        ? opts.singletonConn
        : 'default',
      region: !isEmpty(opts.region)
        ? opts.region
        : config.rds.aurora.mysql.region,
    });
    const input = validateFields(Object.assign({ sql }, opts), [
      { key: 'sql', type: 'string', required: true },
      { key: 'singletonConn', type: 'string', required: true },
      { key: 'region', type: 'string', required: true },
      { key: 'secretArn', type: 'string', required: false },
      { key: 'resourceArn', type: 'string', required: false },
      { key: 'databaseName', type: 'string', required: false },
    ]);
    return queryService(input.sql, input);
  });
export default query;
