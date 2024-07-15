import config from '../../config/aws';
import updateRecordService from '../../services/DynamoDbService/updateRecord';
import isEmpty from '../isEmpty';
export const updateRecord = (
  key,
  tableName,
  {
    singletonConn = 'default',
    region = '',
    updateExpression = '',
    expressionAttributeValues = {},
    conditionExpression,
    expressionAttributeNames,
  } = {}
) => {
  region = isEmpty(region) ? config.dynamodb.region : region;
  return updateRecordService(key, tableName, {
    region,
    singletonConn,
    updateExpression,
    expressionAttributeValues,
    conditionExpression,
    expressionAttributeNames,
  });
};
export default updateRecord;
