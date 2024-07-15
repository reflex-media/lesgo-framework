import config from '../../config/aws';
import queryCountService from '../../services/DynamoDbService/queryCount';
import isEmpty from '../isEmpty';
const queryCount = (
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  { filterExpression, singletonConn = 'default', region = '', indexName } = {}
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
