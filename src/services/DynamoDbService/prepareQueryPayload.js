const prepareQueryPayload = (
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  projectionExpression
) => {
  return {
    TableName: tableName,
    KeyConditionExpression: keyConditionExpression,
    ProjectionExpression: projectionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  };
};

export default prepareQueryPayload;
