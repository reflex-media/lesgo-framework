import config from '../../config/aws';
import queryCountService from '../../services/DynamoDbService/queryCount';
import isEmpty from '../isEmpty';

export interface QueryCountOptions {
  filterExpression?: string;
  singletonConn?: string;
  region?: string;
  indexName?: string;
}

const queryCount = (
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

  return queryCountService(
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
