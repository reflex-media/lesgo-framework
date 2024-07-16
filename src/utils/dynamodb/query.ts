import config from '../../config/aws';
import queryService from '../../services/DynamoDbService/query';
import isEmpty from '../isEmpty';

export interface QueryOptions {
  filterExpression?: string;
  projectionExpression?: string;
  expressionAttributeNames?: Record<string, string>;
  singletonConn?: string;
  region?: string;
  indexName?: string;
}

export const query = async (
  tableName: string,
  keyConditionExpression: string,
  expressionAttributeValues: Record<string, string>,
  {
    filterExpression,
    projectionExpression,
    expressionAttributeNames,
    indexName,
    singletonConn = 'default',
    region = '',
  }: QueryOptions = {}
) => {
  region = isEmpty(region) ? config.dynamodb.region : region;

  return queryService(
    tableName,
    keyConditionExpression,
    expressionAttributeValues,
    {
      region,
      singletonConn,
      filterExpression,
      projectionExpression,
      expressionAttributeNames,
      indexName,
    }
  );
};

export default query;
