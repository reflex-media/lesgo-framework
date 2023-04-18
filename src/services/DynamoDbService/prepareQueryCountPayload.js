const prepareQueryCountPayload = (
  tableName,
  keyConditionExpression,
  expressionAttributeValues
) => {
  return {
    TableName: tableName,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    Select: 'COUNT',
  };
};

export default prepareQueryCountPayload;
