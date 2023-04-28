import config from 'config/aws'; // eslint-disable-line import/no-unresolved
import queryCount from '../../services/DynamoDbService/queryCount';

export default (
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  { filterExpression = '', singletonConn = 'default', indexName = '' } = {}
) => {
  const { region } = config;

  return queryCount(
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
