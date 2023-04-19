const prepareQueryCountPayload = (
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  { filterExpression = '' }
) => {
  let payload = {
    TableName: tableName,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    Select: 'COUNT',
  };

  if (filterExpression) {
    payload = {
      ...payload,
      FilterExpression: filterExpression,
    };
  }

  return payload;
};

export default prepareQueryCountPayload;
