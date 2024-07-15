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
import logger from '../../utils/logger';
import getClient from './getClient';
import { prepareQueryInput } from './query';
const FILE = 'lesgo.services.DynamoDbService.queryCount';
const queryCount = (
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  opts
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const params = prepareQueryInput(
      tableName,
      keyConditionExpression,
      expressionAttributeValues,
      Object.assign(Object.assign({}, opts), { select: 'COUNT' })
    );
    logger.debug(`${FILE}::QUERY_PREPARED`, { params });
    const client = getClient({
      singletonConn: opts.singletonConn,
      region: opts.region,
    });
    try {
      const data = yield client.send(new QueryCommand(params));
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
      return data.Count;
    } catch (err) {
      throw new LesgoException(
        'Dynamodb query count failed',
        `${FILE}::FAILED`,
        500,
        {
          err,
          params,
        }
      );
    }
  });
export default queryCount;
