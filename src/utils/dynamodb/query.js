import config from 'config/aws'; // eslint-disable-line import/no-unresolved
import query from '../../services/DynamoDbService/query';

export default (
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  projectionExpression,
  { singletonConn = 'default' } = {}
) => {
  const { region } = config;

  return query(
    tableName,
    keyConditionExpression,
    expressionAttributeValues,
    projectionExpression,
    { region, singletonConn }
  );
};
