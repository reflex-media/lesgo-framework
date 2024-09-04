import { ClientOptions } from '../../types/aws';
import updateRecordService, {
  Key,
  UpdateRecordOptions,
} from '../../services/DynamoDbService/updateRecord';
import { NativeAttributeValue } from '@aws-sdk/lib-dynamodb';

export const updateRecord = async (
  key: Key,
  tableAlias: string,
  updateExpression: string,
  expressionAttributeValues: Record<string, NativeAttributeValue>,
  opts?: UpdateRecordOptions,
  clientOpts?: ClientOptions
) => {
  return updateRecordService(
    key,
    tableAlias,
    updateExpression,
    expressionAttributeValues,
    opts,
    clientOpts
  );
};

export default updateRecord;
