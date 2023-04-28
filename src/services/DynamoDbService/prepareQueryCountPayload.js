const prepareQueryCountPayload = (
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  { filterExpression = '', indexName = '' }
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

  if (indexName) {
    payload = {
      ...payload,
      IndexName: indexName,
    };
  }

  return payload;
};

export default prepareQueryCountPayload;
