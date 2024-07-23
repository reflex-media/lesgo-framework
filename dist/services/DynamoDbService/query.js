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
import { validateFields, logger } from '../../utils';
import getClient from './getClient';
import getTableName from './getTableName';
const FILE = 'lesgo.services.DynamoDbService.query';
const query = (
  tableAlias,
  keyConditionExpression,
  expressionAttributeValues,
  opts,
  clientOpts
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const input = validateFields(
      { tableAlias, keyConditionExpression, expressionAttributeValues },
      [
        { key: 'tableAlias', type: 'string', required: true },
        { key: 'keyConditionExpression', type: 'string', required: true },
        { key: 'expressionAttributeValues', type: 'object', required: true },
      ]
    );
    const tableName = getTableName(input.tableAlias);
    const client = getClient(clientOpts);
    const commandInput = Object.assign(Object.assign({}, opts), {
      TableName: tableName,
      KeyConditionExpression: input.keyConditionExpression,
      ExpressionAttributeValues: input.expressionAttributeValues,
    });
    try {
      const data = yield client.send(new QueryCommand(commandInput));
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data, commandInput });
      return data;
    } catch (error) {
      throw new LesgoException('Failed to query', `${FILE}::ERROR`, 500, {
        error,
        commandInput,
        opts,
      });
    }
  });
export default query;
