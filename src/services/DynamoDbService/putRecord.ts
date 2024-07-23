import {
  NativeAttributeValue,
  PutCommand,
  PutCommandInput,
} from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import { validateFields, logger } from '../../utils';
import { ClientOptions } from '../../types/aws';
import getTableName from './getTableName';
import getClient from './getClient';

const FILE = 'lesgo.services.DynamoDbService.putRecord';

export type Item = Record<string, NativeAttributeValue>;

const putRecord = async (
  item: Item,
  tableAlias: string,
  opts?: PutCommandInput,
  clientOpts?: ClientOptions
) => {
  const input = validateFields({ item, tableAlias }, [
    { key: 'item', type: 'object', required: true },
    { key: 'tableAlias', type: 'string', required: true },
  ]);

  const tableName = getTableName(input.tableAlias);
  const client = getClient(clientOpts);

  const commandInput: PutCommandInput = {
    TableName: tableName,
    Item: input.item,
    ...opts,
  };

  try {
    const resp = await client.send(new PutCommand(commandInput));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { resp, commandInput });
    return resp;
  } catch (error) {
    throw new LesgoException('Failed to put record', `${FILE}::ERROR`, 500, {
      error,
      commandInput,
      clientOpts,
    });
  }
};

export default putRecord;
