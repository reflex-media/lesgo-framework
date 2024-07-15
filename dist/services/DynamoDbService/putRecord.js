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
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import config from '../../config/aws';
import getClient from './getClient';
const FILE = 'lesgo.services.DynamoDbService.putRecord';
const putRecord = (item, tableName, { region, singletonConn }) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const input = {
      TableName:
        (_a = config.dynamodb.tables.find(t => t.alias === tableName)) ===
          null || _a === void 0
          ? void 0
          : _a.name,
      Item: item,
    };
    logger.debug(`${FILE}::QUERY_PREPARED`, { input });
    const client = getClient({ singletonConn, region });
    try {
      const resp = yield client.send(new PutCommand(input));
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { resp });
      return resp;
    } catch (err) {
      throw new LesgoException('Failed to put record', `${FILE}::ERROR`, 500, {
        err,
        input,
      });
    }
  });
export default putRecord;
