import config from '../../config/aws';
import queryService from '../../services/DynamoDbService/query';
import isEmpty from '../isEmpty';
export const query = (
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  {
    filterExpression = '',
    projectionExpression = '',
    expressionAttributeNames = {},
    singletonConn = 'default',
    region = '',
    indexName = '',
  } = {}
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
