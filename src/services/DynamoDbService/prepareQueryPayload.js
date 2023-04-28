const prepareQueryPayload = (
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  { filterExpression = '', projectionExpression = '', indexName = '' }
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
