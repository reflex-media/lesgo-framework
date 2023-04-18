import config from 'config/aws'; // eslint-disable-line import/no-unresolved
import queryCount from '../../services/DynamoDbService/queryCount';

export default (
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  projectionExpression,
  { singletonConn = 'default' } = {}
) => {
  const { region } = config;

  return queryCount(
    tableName,
    keyConditionExpression,
    expressionAttributeValues,
    projectionExpression,
    { region, singletonConn }
  );
};
