import { DeleteCommand, NativeAttributeValue } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import dynamodbConfig from '../../config/dynamodb';
import { validateFields, logger } from '../../utils';
import getClient, { GetClientOptions } from './getClient';

const FILE = 'lesgo.services.DynamoDbService.deleteRecord';

export type Key = Record<string, NativeAttributeValue>;

const deleteRecord = async (
  key: Key,
  tableName: string,
  clientOpts?: GetClientOptions
) => {
  const input = validateFields({ key, tableName }, [
    { key: 'key', type: 'object', required: true },
    { key: 'tableName', type: 'string', required: true },
  ]) as { key: Key; tableName: string };

  const client = getClient(clientOpts);

  const commandInput = {
    TableName: dynamodbConfig.tables.find(t => t.alias === input.tableName)
      ?.name,
    Key: input.key,
  };
  logger.debug(`${FILE}::QUERY_PREPARED`, { commandInput, clientOpts });

  try {
    const data = await client.send(new DeleteCommand(commandInput));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
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
