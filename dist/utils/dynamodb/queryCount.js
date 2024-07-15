import config from '../../config/aws';
import queryService from '../../services/DynamoDbService/query';
import isEmpty from '../isEmpty';
const queryCount = (
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  { filterExpression, singletonConn = 'default', region = '', indexName } = {}
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
