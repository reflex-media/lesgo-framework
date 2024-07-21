import { GetClientOptions } from '../../services/DynamoDbService/getClient';
import putRecordService, {
  Item,
} from '../../services/DynamoDbService/putRecord';

const putRecord = async (
  item: Item,
  tableName: string,
  clientOpts?: GetClientOptions
) => {
  return putRecordService(item, tableName, clientOpts);
};

export default putRecord;
