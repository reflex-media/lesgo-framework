const prepareQueryPayload = (
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  {
    filterExpression = '',
    projectionExpression = '',
    expressionAttributeNames = '',
    indexName = '',
  }
) => {
  let payload = {
    TableName: tableName,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  if (projectionExpression) {
    payload = {
      ...payload,
      ProjectionExpression: projectionExpression,
    };
  }

  if (expressionAttributeNames) {
    payload = {
      ...payload,
      ExpressionAttributeNames: expressionAttributeNames,
    };
  }

  if (filterExpression) {
    payload = {
      ...payload,
      FilterExpression: filterExpression,
    };
  }

  if (indexName) {
    payload = {
      ...payload,
      IndexName: indexName,
    };
  }

  return payload;
};

export default prepareQueryPayload;
