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
import { validateFields, logger } from '../../utils';
import getTableName from './getTableName';
import getClient from './getClient';
const FILE = 'lesgo.services.DynamoDbService.putRecord';
const putRecord = (item, tableAlias, opts, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const input = validateFields({ item, tableAlias }, [
      { key: 'item', type: 'object', required: true },
      { key: 'tableAlias', type: 'string', required: true },
    ]);
    const tableName = getTableName(input.tableAlias);
    const client = getClient(clientOpts);
    const commandInput = Object.assign(Object.assign({}, opts), {
      TableName: tableName,
      Item: input.item,
    });
    try {
      const resp = yield client.send(new PutCommand(commandInput));
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { resp, commandInput });
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
