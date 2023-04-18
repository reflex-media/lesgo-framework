import isEmpty from '../../utils/isEmpty';

const prepareUpdatePayload = (
  tableName,
  key,
  updateExpression,
  expressionAttributeValues,
  opts
) => {
  let payload = {
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  if (!isEmpty(opts.conditionExpression)) {
    payload = {
      ...payload,
      ConditionExpression: opts.conditionExpression,
    };
  }

  return payload;
};

export default prepareUpdatePayload;
