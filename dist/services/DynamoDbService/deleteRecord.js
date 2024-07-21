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
import dynamodbConfig from '../../config/dynamodb';
import { validateFields, logger } from '../../utils';
import getClient from './getClient';
const FILE = 'lesgo.services.DynamoDbService.deleteRecord';
const deleteRecord = (key, tableName, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const input = validateFields({ key, tableName }, [
      { key: 'key', type: 'object', required: true },
      { key: 'tableName', type: 'string', required: true },
    ]);
    const client = getClient(clientOpts);
    const commandInput = {
      TableName:
        (_a = dynamodbConfig.tables.find(t => t.alias === input.tableName)) ===
          null || _a === void 0
          ? void 0
          : _a.name,
      Key: input.key,
    };
    logger.debug(`${FILE}::QUERY_PREPARED`, { commandInput, clientOpts });
    try {
      const data = yield client.send(new DeleteCommand(commandInput));
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
      return data;
    } catch (error) {
      throw new LesgoException(
        'Failed to delete record',
        `${FILE}::ERROR`,
        500,
        {
          error,
          commandInput,
          clientOpts,
        }
      );
    }
  });
export default deleteRecord;
