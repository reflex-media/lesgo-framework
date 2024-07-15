import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import config from '../../config/aws';
import getClient from './getClient';

const FILE = 'lesgo.services.DynamoDbService.query';

export interface QueryInputOptions {
  filterExpression?: string;
  projectionExpression?: string;
  expressionAttributeNames?: Record<string, string>;
  indexName?: string;
  select?: string;
}

export interface QueryOptions extends QueryInputOptions {
  region: string;
  singletonConn: string;
}

export const prepareQueryInput = (
  tableName: string,
  keyConditionExpression: string,
  expressionAttributeValues: Record<string, any>,
  opts: QueryInputOptions
) => {
  const input: QueryCommandInput = {
    TableName: config.dynamodb.tables.find(t => t.alias === tableName)?.name,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  input.ProjectionExpression = opts.projectionExpression;
  input.ExpressionAttributeNames = opts.expressionAttributeNames;
  input.FilterExpression = opts.filterExpression;
  input.IndexName = opts.indexName;
  input.Select = opts.select as QueryCommandInput['Select'];

  return input;
};

const query = async (
  tableName: string,
  keyConditionExpression: string,
  expressionAttributeValues: Record<string, any>,
  opts: QueryOptions
) => {
  const params = prepareQueryInput(
    tableName,
    keyConditionExpression,
    expressionAttributeValues,
    opts
  );
  logger.debug(`${FILE}::QUERY_PREPARED`, { params });

  const client = getClient({
    singletonConn: opts.singletonConn,
    region: opts.region,
  });

  try {
    const data = await client.send(new QueryCommand(params));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
    return data.Items;
  } catch (err) {
    throw new LesgoException('Failed to query', `${FILE}::ERROR`, 500, {
      err,
      params,
    });
  }
};

export default query;
