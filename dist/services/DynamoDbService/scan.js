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
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import { validateFields, logger } from '../../utils';
import getClient from './getClient';
import getTableName from './getTableName';
const FILE = 'lesgo.services.DynamoDbService.scan';
const scan = (tableAlias, opts, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const input = validateFields(Object.assign({ tableAlias }, opts), [
      { key: 'tableAlias', type: 'string', required: true },
    ]);
    const tableName = getTableName(input.tableAlias);
    const client = getClient(clientOpts);
    const commandInput = Object.assign(Object.assign({}, opts), {
      TableName: tableName,
    });
    try {
      const data = yield client.send(new ScanCommand(commandInput));
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data, commandInput });
      return data;
    } catch (error) {
      throw new LesgoException('Failed to scan', `${FILE}::ERROR`, 500, {
        error,
        commandInput,
        opts,
      });
    }
  });
export default scan;
