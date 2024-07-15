import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import config from '../../config/aws';
import getClient from './getClient';
import { prepareQueryInput } from './query';

const FILE = 'lesgo.services.DynamoDbService.queryCount';

export interface QueryCountInputOptions {
  filterExpression?: string;
  indexName?: string;
}

export interface QueryCountOptions extends QueryCountInputOptions {
  region: string;
  singletonConn: string;
}

const queryCount = async (
  tableName: string,
  keyConditionExpression: string,
  expressionAttributeValues: Record<string, any>,
  opts: QueryCountOptions
) => {
  const params = prepareQueryInput(
    config.dynamodb.tables.find(t => t.alias === tableName)?.name as string,
    keyConditionExpression,
    expressionAttributeValues,
    {
      ...opts,
      select: 'COUNT',
    }
  );
  logger.debug(`${FILE}::QUERY_PREPARED`, { params });

  const client = getClient({
    singletonConn: opts.singletonConn,
    region: opts.region,
  });

  try {
    const data = await client.send(new QueryCommand(params));
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
};

export default queryCount;
