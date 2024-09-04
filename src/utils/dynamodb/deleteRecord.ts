import { ClientOptions } from '../../types/aws';
import deleteRecordService, {
  Key,
} from '../../services/DynamoDbService/deleteRecord';
import { DeleteCommandInput } from '@aws-sdk/lib-dynamodb';

const deleteRecord = async (
  key: Key,
  tableAlias: string,
  opts?: DeleteCommandInput,
  clientOpts?: ClientOptions
) => {
  return deleteRecordService(key, tableAlias, opts, clientOpts);
};

export default deleteRecord;
