import {
  DeleteCommand,
  DeleteCommandInput,
  NativeAttributeValue,
} from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import config from '../../config/aws';
import getClient, { GetClientOptions } from './getClient';

const FILE = 'lesgo.services.DynamoDbService.deleteRecord';

export type Key = Record<string, NativeAttributeValue>;

const deleteRecord = async (
  key: Record<string, string>,
  tableName: string,
  { region, singletonConn }: GetClientOptions
) => {
  const input: DeleteCommandInput = {
    TableName: config.dynamodb.tables.find(t => t.alias === tableName)?.name,
    Key: key,
  };
  logger.debug(`${FILE}::QUERY_PREPARED`, { input });

  const client = getClient({ singletonConn, region });

  try {
    const data = await client.send(new DeleteCommand(input));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
    return data;
  } catch (err) {
    throw new LesgoException('Failed to delete record', `${FILE}::ERROR`, 500, {
      err,
      input,
    });
  }
};

export default deleteRecord;
