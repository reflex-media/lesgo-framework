import config from '../../config/aws';
import scanService from '../../services/DynamoDbService/scan';
import isEmpty from '../isEmpty';
export const scan = (
  tableName,
  {
    filterExpression,
    expressionAttributeValues,
    projectionExpression,
    expressionAttributeNames,
    indexName,
    singletonConn = 'default',
    region = '',
  } = {}
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
