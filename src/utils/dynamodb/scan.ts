import config from '../../config/aws';
import scanService from '../../services/DynamoDbService/scan';
import isEmpty from '../isEmpty';

export interface ScanOptions {
  filterExpression?: string;
  projectionExpression?: string;
  expressionAttributeValues?: Record<string, string>;
  expressionAttributeNames?: Record<string, string>;
  singletonConn?: string;
  region?: string;
  indexName?: string;
}

export const scan = async (
  tableName: string,
  {
    filterExpression,
    expressionAttributeValues,
    projectionExpression,
    expressionAttributeNames,
    indexName,
    singletonConn = 'default',
    region = '',
  }: ScanOptions = {}
) => {
  region = isEmpty(region) ? config.dynamodb.region : region;

  return scanService(tableName, {
    region,
    singletonConn,
    filterExpression,
    expressionAttributeValues,
    projectionExpression,
    expressionAttributeNames,
    indexName,
  });
};

export default scan;
