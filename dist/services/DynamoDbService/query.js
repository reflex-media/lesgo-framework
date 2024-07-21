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
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import dynamodbConfig from '../../config/dynamodb';
import getClient from './getClient';
import { validateFields, logger } from '../../utils';
const FILE = 'lesgo.services.DynamoDbService.query';
export const prepareQueryInput = input => {
  var _a;
  const commandInput = {
    TableName:
      (_a = dynamodbConfig.tables.find(t => t.alias === input.tableName)) ===
        null || _a === void 0
        ? void 0
        : _a.name,
    KeyConditionExpression: input.keyConditionExpression,
    ExpressionAttributeValues: input.expressionAttributeValues,
  };
  commandInput.FilterExpression = input.filterExpression;
  commandInput.ProjectionExpression = input.projectionExpression;
  commandInput.ExpressionAttributeNames = input.expressionAttributeNames;
  commandInput.IndexName = input.indexName;
  commandInput.Select = input.select;
  return commandInput;
};
const query = (
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  opts,
  clientOpts
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const input = validateFields(
      Object.assign(
        { tableName, keyConditionExpression, expressionAttributeValues },
        opts
      ),
      [
        { key: 'tableName', type: 'string', required: true },
        { key: 'keyConditionExpression', type: 'string', required: true },
        { key: 'expressionAttributeValues', type: 'object', required: true },
        { key: 'filterExpression', type: 'string', required: false },
        { key: 'projectionExpression', type: 'string', required: false },
        { key: 'expressionAttributeNames', type: 'object', required: false },
        { key: 'indexName', type: 'string', required: false },
        { key: 'select', type: 'string', required: false },
      ]
    );
    const client = getClient(clientOpts);
    const commandInput = prepareQueryInput(input);
    logger.debug(`${FILE}::QUERY_PREPARED`, { commandInput });
    try {
      const data = yield client.send(new QueryCommand(commandInput));
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
      return data.Items;
    } catch (error) {
      throw new LesgoException('Failed to query', `${FILE}::ERROR`, 500, {
        error,
        commandInput,
        opts,
      });
    }
  });
export default query;
