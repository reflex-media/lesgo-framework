import { ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import config from '../../config/aws';
import getClient from './getClient';

const FILE = 'lesgo.services.DynamoDbService.scan';

export interface ScanInputOptions {
  filterExpression?: string;
  expressionAttributeValues?: Record<string, string>;
  projectionExpression?: string;
  expressionAttributeNames?: Record<string, string>;
  indexName?: string;
  select?: string;
}

export interface ScanOptions extends ScanInputOptions {
  region: string;
  singletonConn: string;
}

export const prepareScanInput = (tableName: string, opts: ScanInputOptions) => {
  const input: ScanCommandInput = {
    TableName: config.dynamodb.tables.find(t => t.alias === tableName)?.name,
  };

  input.FilterExpression = opts.filterExpression;
  input.ExpressionAttributeValues = opts.expressionAttributeValues;
  input.ProjectionExpression = opts.projectionExpression;
  input.ExpressionAttributeNames = opts.expressionAttributeNames;
  input.IndexName = opts.indexName;
  input.Select = opts.select as ScanCommandInput['Select'];

  return input;
};

const scan = async (tableName: string, opts: ScanOptions) => {
  const params = prepareScanInput(tableName, opts);
  logger.debug(`${FILE}::SCAN_PREPARED`, { params });

  const client = getClient({
    singletonConn: opts.singletonConn,
    region: opts.region,
  });

  try {
    const data = await client.send(new ScanCommand(params));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
    return data.Items;
  } catch (err) {
    throw new LesgoException('Failed to scan', `${FILE}::ERROR`, 500, {
      err,
      params,
    });
  }
};

export default scan;
