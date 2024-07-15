import config from '../../config/aws';
import updateRecordService, {
  Key,
} from '../../services/DynamoDbService/updateRecord';
import isEmpty from '../isEmpty';

export const updateRecord = (
  key: Key,
  tableName: string,
  {
    singletonConn = 'default',
    region = '',
    updateExpression = '',
    expressionAttributeValues = {},
    conditionExpression = '',
    expressionAttributeNames = {},
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
