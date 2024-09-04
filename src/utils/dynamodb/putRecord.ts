import { ClientOptions } from '../../types/aws';
import putRecordService, {
  Item,
  PutRecordOptions,
} from '../../services/DynamoDbService/putRecord';

const putRecord = async (
  item: Item,
  tableAlias: string,
  opts?: PutRecordOptions,
  clientOpts?: ClientOptions
) => {
  return putRecordService(item, tableAlias, opts, clientOpts);
};

export default putRecord;
