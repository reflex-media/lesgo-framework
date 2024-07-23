import {
  DeleteCommand,
  DeleteCommandInput,
  NativeAttributeValue,
} from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import { validateFields, logger } from '../../utils';
import { ClientOptions } from '../../types/aws';
import getClient from './getClient';
import getTableName from './getTableName';

const FILE = 'lesgo.services.DynamoDbService.deleteRecord';

export type Key = Record<string, NativeAttributeValue>;

export interface DeleteRecordOptions
  extends Partial<Omit<DeleteCommandInput, 'TableName'>> {
  TableName?: string;
}

const deleteRecord = async (
  key: Key,
  tableAlias: string,
  opts?: DeleteRecordOptions,
  clientOpts?: ClientOptions
) => {
  const input = validateFields({ key, tableAlias }, [
    { key: 'key', type: 'object', required: true },
    { key: 'tableAlias', type: 'string', required: true },
  ]);

  const tableName = getTableName(input.tableAlias);
  const client = getClient(clientOpts);

  const commandInput: DeleteCommandInput = {
    TableName: tableName,
    Key: input.key,
    ...opts,
  };

  try {
    const data = await client.send(new DeleteCommand(commandInput));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data, commandInput });
    return data;
  } catch (error) {
    throw new LesgoException('Failed to delete record', `${FILE}::ERROR`, 500, {
      error,
      commandInput,
      clientOpts,
    });
  }
};

export default deleteRecord;
