import {
  NativeAttributeValue,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import { logger, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import getClient from './getClient';
import getTableName from './getTableName';

const FILE = 'lesgo.services.DynamoDbService.updateRecord';

export type Key = Record<string, NativeAttributeValue>;

export type UpdateRecordOptions = Omit<
  UpdateCommandInput,
  'TableName' | 'Key'
> & {
  TableName?: string;
  Key?: Record<string, NativeAttributeValue> | undefined;
};

const updateRecord = async (
  key: Record<string, string>,
  tableAlias: string,
  updateExpression: string,
  expressionAttributeValues: Record<string, NativeAttributeValue>,
  opts?: UpdateRecordOptions,
  clientOpts?: ClientOptions
) => {
  const input = validateFields(
    { key, tableAlias, updateExpression, expressionAttributeValues, ...opts },
    [
      { key: 'key', type: 'object', required: true },
      { key: 'tableAlias', type: 'string', required: true },
      { key: 'updateExpression', type: 'string', required: true },
      { key: 'expressionAttributeValues', type: 'object', required: true },
    ]
  );

  const tableName = getTableName(input.tableAlias);
  const client = getClient(clientOpts);

  const commandInput = {
    TableName: tableName,
    Key: input.key,
    UpdateExpression: input.updateExpression,
    ExpressionAttributeValues: input.expressionAttributeValues,
    ...opts,
  };

  try {
    const data = await client.send(new UpdateCommand(commandInput));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data, commandInput });
    return data;
  } catch (error) {
    throw new LesgoException('Failed to update record', `${FILE}::ERROR`, 500, {
      error,
      commandInput,
      opts,
    });
  }
};

export default updateRecord;
