import { GetClientOptions } from '../../services/DynamoDbService/getClient';
import updateRecordService, {
  Key,
  UpdateRecordInputOptions,
} from '../../services/DynamoDbService/updateRecord';

export const updateRecord = async (
  key: Key,
  tableName: string,
  updateExpression: string,
  expressionAttributeValues: Record<string, string>,
  opts?: UpdateRecordInputOptions,
  clientOpts?: GetClientOptions
) => {
  return updateRecordService(
    key,
    tableName,
    updateExpression,
    expressionAttributeValues,
    opts,
    clientOpts
  );
};

export default updateRecord;
