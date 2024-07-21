import { GetClientOptions } from '../../services/DynamoDbService/getClient';
import deleteRecordService, {
  Key,
} from '../../services/DynamoDbService/deleteRecord';

const deleteRecord = async (
  key: Key,
  tableName: string,
  clientOpts?: GetClientOptions
) => {
  return deleteRecordService(key, tableName, clientOpts);
};

export default deleteRecord;
