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
import { logger, validateFields } from '../../utils';
import getClient from './getClient';
import getTableName from './getTableName';
const FILE = 'lesgo.services.DynamoDbService.updateRecord';
const updateRecord = (
  key,
  tableAlias,
  updateExpression,
  expressionAttributeValues,
  opts,
  clientOpts
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const input = validateFields(
      Object.assign(
        { key, tableAlias, updateExpression, expressionAttributeValues },
        opts
      ),
      [
        { key: 'key', type: 'object', required: true },
        { key: 'tableAlias', type: 'string', required: true },
        { key: 'updateExpression', type: 'string', required: true },
        { key: 'expressionAttributeValues', type: 'object', required: true },
      ]
    );
    const tableName = getTableName(input.tableAlias);
    const client = getClient(clientOpts);
    const commandInput = Object.assign(Object.assign({}, opts), {
      TableName: tableName,
      Key: input.key,
      UpdateExpression: input.updateExpression,
      ExpressionAttributeValues: input.expressionAttributeValues,
    });
    try {
      const data = yield client.send(new UpdateCommand(commandInput));
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data, commandInput });
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
