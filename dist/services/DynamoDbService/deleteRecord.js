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
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import getClient from './getClient';
const FILE = 'lesgo.services.DynamoDbService.deleteRecord';
const deleteRecord = (key, tableName, { region, singletonConn }) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const input = {
      TableName: tableName,
      Key: key,
    };
    logger.debug(`${FILE}::QUERY_PREPARED`, { input });
    const client = getClient({ singletonConn, region });
    try {
      const data = yield client.send(new DeleteCommand(input));
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
      return data;
    } catch (err) {
      throw new LesgoException(
        'Failed to delete record',
        `${FILE}::ERROR`,
        500,
        {
          err,
          input,
        }
      );
    }
  });
export default deleteRecord;
