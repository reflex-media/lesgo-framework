import { ClientOptions } from '../../types/aws';
import updateRecordService, {
  Key,
  UpdateRecordOptions,
} from '../../services/DynamoDbService/updateRecord';

export const updateRecord = async (
  key: Key,
  tableAlias: string,
  updateExpression: string,
  expressionAttributeValues: Record<string, string>,
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
