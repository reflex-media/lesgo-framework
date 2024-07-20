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
import queryService from '../../../services/RDSAuroraMySQLDataAPIService/query';
import validateFields from '../../validateFields';
const query = (key, bucket, { singletonConn = 'default', region = '' } = {}) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const input = validateFields({ key, bucket, singletonConn, region }, [
      { key: 'sql', type: 'string', required: true },
      { key: 'singletonConn', type: 'string', required: true },
      { key: 'region', type: 'string', required: true },
    ]);
    return queryService(input.sql, {
      singletonConn: input.singletonConn,
      region: input.region,
    });
  });
export default query;
