import config from '../../config/aws';
import queryService from '../../services/DynamoDbService/query';
import isEmpty from '../isEmpty';

export interface QueryCountOptions {
  filterExpression?: string;
  singletonConn?: string;
  region?: string;
  indexName?: string;
}

const queryCount = async (
  tableName: string,
  keyConditionExpression: string,
  expressionAttributeValues: Record<string, string>,
  {
    filterExpression,
    singletonConn = 'default',
    region = '',
    indexName,
  }: QueryCountOptions = {}
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
      indexName,
    }
  );
};

export default queryCount;
