import { NativeAttributeValue, PutCommand } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import dynamodbConfig from '../../config/dynamodb';
import getClient, { GetClientOptions } from './getClient';
import { validateFields, logger } from '../../utils';

const FILE = 'lesgo.services.DynamoDbService.putRecord';

export type Item = Record<string, NativeAttributeValue>;

const putRecord = async (
  item: Item,
  tableName: string,
  clientOpts?: GetClientOptions
) => {
  const input = validateFields({ item, tableName }, [
    { key: 'item', type: 'object', required: true },
    { key: 'tableName', type: 'string', required: true },
  ]) as { item: Item; tableName: string };

  const client = getClient(clientOpts);

  const commandInput = {
    TableName: dynamodbConfig.tables.find(t => t.alias === input.tableName)
      ?.name,
    Item: input.item,
  };
  logger.debug(`${FILE}::QUERY_PREPARED`, { commandInput, clientOpts });

  try {
    const resp = await client.send(new PutCommand(commandInput));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { resp });
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
