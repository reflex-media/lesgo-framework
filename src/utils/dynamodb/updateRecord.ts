import config from '../../config/aws';
import updateRecordService, {
  Key,
} from '../../services/DynamoDbService/updateRecord';
import isEmpty from '../isEmpty';

export interface UpdateRecordOptions {
  updateExpression?: string;
  expressionAttributeValues?: Record<string, any>;
  conditionExpression?: string;
  expressionAttributeNames?: Record<string, string>;
  singletonConn?: string;
  region?: string;
}

export const updateRecord = async (
  key: Key,
  tableName: string,
  {
    singletonConn = 'default',
    region = '',
    updateExpression = '',
    expressionAttributeValues = {},
    conditionExpression,
    expressionAttributeNames,
  }: UpdateRecordOptions = {}
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
