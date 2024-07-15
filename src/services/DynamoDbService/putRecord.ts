import {
  NativeAttributeValue,
  PutCommand,
  PutCommandInput,
} from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import getClient, { GetClientOptions } from './getClient';

const FILE = 'lesgo.services.DynamoDbService.putRecord';

export type Item = Record<string, NativeAttributeValue>;

const putRecord = async (
  item: Item,
  tableName: string,
  { region, singletonConn }: GetClientOptions
) => {
  const input: PutCommandInput = {
    TableName: tableName,
    Item: item,
  };
  logger.debug(`${FILE}::QUERY_PREPARED`, { input });

  const client = getClient({ singletonConn, region });

  try {
    const resp = await client.send(new PutCommand(input));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { resp });
    return resp;
  } catch (err) {
    throw new LesgoException('Failed to put record', `${FILE}::ERROR`, 500, {
      err,
      input,
    });
  }
};

export default putRecord;
