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
import dynamodbConfig from '../../config/dynamodb';
import getClient from './getClient';
import { validateFields, logger } from '../../utils';
const FILE = 'lesgo.services.DynamoDbService.putRecord';
const putRecord = (item, tableName, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const input = validateFields({ item, tableName }, [
      { key: 'item', type: 'object', required: true },
      { key: 'tableName', type: 'string', required: true },
    ]);
    const client = getClient(clientOpts);
    const commandInput = {
      TableName:
        (_a = dynamodbConfig.tables.find(t => t.alias === input.tableName)) ===
          null || _a === void 0
          ? void 0
          : _a.name,
      Item: input.item,
    };
    logger.debug(`${FILE}::QUERY_PREPARED`, { commandInput, clientOpts });
    try {
      const resp = yield client.send(new PutCommand(commandInput));
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { resp });
      return resp;
    } catch (error) {
      throw new LesgoException('Failed to put record', `${FILE}::ERROR`, 500, {
        error,
        commandInput,
        clientOpts,
      });
    }
  });
export default putRecord;
