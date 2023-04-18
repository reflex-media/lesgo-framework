import config from 'config/aws'; // eslint-disable-line import/no-unresolved
import update from '../../services/DynamoDbService/update';

export default (
  tableName,
  key,
  updateExpression,
  expressionAttributeValues,
  { singletonConn = 'default', conditionExpression = '' } = {}
) => {
  const { region } = config;

  return update(tableName, key, updateExpression, expressionAttributeValues, {
    region,
    singletonConn,
    conditionExpression,
  });
};
