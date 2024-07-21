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
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import { isEmpty, logger, validateFields } from '../../utils';
import dynamodbConfig from '../../config/dynamodb';
import getClient from './getClient';
const FILE = 'lesgo.services.DynamoDbService.updateRecord';
const prepareUpdateInput = input => {
  var _a;
  let commandInput = {
    TableName:
      (_a = dynamodbConfig.tables.find(t => t.alias === input.tableName)) ===
        null || _a === void 0
        ? void 0
        : _a.name,
    Key: input.key,
    UpdateExpression: input.updateExpression,
    ExpressionAttributeValues: input.expressionAttributeValues,
  };
  if (!isEmpty(input.conditionExpression)) {
    commandInput = Object.assign(Object.assign({}, commandInput), {
      ConditionExpression: input.conditionExpression,
    });
  }
  if (!isEmpty(input.expressionAttributeNames)) {
    commandInput = Object.assign(Object.assign({}, commandInput), {
      ExpressionAttributeNames: input.expressionAttributeNames,
    });
  }
  return commandInput;
};
const updateRecord = (
  key,
  tableName,
  updateExpression,
  expressionAttributeValues,
  opts,
  clientOpts
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const input = validateFields(
      Object.assign(
        { key, tableName, updateExpression, expressionAttributeValues },
        opts
      ),
      [
        { key: 'key', type: 'object', required: true },
        { key: 'tableName', type: 'string', required: true },
        { key: 'updateExpression', type: 'string', required: true },
        { key: 'expressionAttributeValues', type: 'object', required: true },
        { key: 'conditionExpression', type: 'string', required: false },
        { key: 'expressionAttributeNames', type: 'object', required: false },
      ]
    );
    const client = getClient(clientOpts);
    const commandInput = prepareUpdateInput(input);
    logger.debug(`${FILE}::QUERY_PREPARED`, { commandInput });
    try {
      const data = yield client.send(new UpdateCommand(commandInput));
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
      return data;
    } catch (error) {
      throw new LesgoException(
        'Failed to update record',
        `${FILE}::ERROR`,
        500,
        {
          error,
          commandInput,
          opts,
        }
      );
    }
  });
export default updateRecord;
