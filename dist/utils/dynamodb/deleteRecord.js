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
import config from '../../config/aws';
import deleteRecordService from '../../services/DynamoDbService/deleteRecord';
import isEmpty from '../isEmpty';
const deleteRecord = (
  key,
  tableName,
  { singletonConn = 'default', region = '' } = {}
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    region = isEmpty(region) ? config.dynamodb.region : region;
    return deleteRecordService(key, tableName, { region, singletonConn });
  });
export default deleteRecord;
