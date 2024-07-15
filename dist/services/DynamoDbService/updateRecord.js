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
import { isEmpty, logger } from '../../utils';
import config from '../../config/aws';
import getClient from './getClient';
const FILE = 'lesgo.services.DynamoDbService.updateRecord';
const prepareUpdateInput = (key, tableName, opts) => {
  var _a;
  let input = {
    TableName:
      (_a = config.dynamodb.tables.find(t => t.alias === tableName)) === null ||
      _a === void 0
        ? void 0
        : _a.name,
    Key: key,
    UpdateExpression: opts.updateExpression,
    ExpressionAttributeValues: opts.expressionAttributeValues,
  };
  if (!isEmpty(opts.conditionExpression)) {
    input = Object.assign(Object.assign({}, input), {
      ConditionExpression: opts.conditionExpression,
    });
  }
  if (!isEmpty(opts.expressionAttributeNames)) {
    input = Object.assign(Object.assign({}, input), {
      ExpressionAttributeNames: opts.expressionAttributeNames,
    });
  }
  return input;
};
const updateRecord = (
  key,
  tableName,
  {
    region,
    singletonConn,
    updateExpression,
    expressionAttributeValues,
    conditionExpression,
    expressionAttributeNames,
  }
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const params = prepareUpdateInput(key, tableName, {
      updateExpression,
      expressionAttributeValues,
      conditionExpression,
      expressionAttributeNames,
    });
    logger.debug(`${FILE}::QUERY_PREPARED`, { params });
    const client = getClient({ singletonConn, region });
    try {
      const data = yield client.send(new UpdateCommand(params));
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
      return data;
    } catch (err) {
      throw new LesgoException(
        'Failed to update record',
        `${FILE}::ERROR`,
        500,
        {
          err,
          params,
        }
      );
    }
  });
export default updateRecord;
