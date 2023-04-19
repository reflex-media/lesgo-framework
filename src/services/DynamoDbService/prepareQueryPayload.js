const prepareQueryPayload = (
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  { filterExpression = '', projectionExpression = '' }
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

  return payload;
};

export default prepareQueryPayload;
