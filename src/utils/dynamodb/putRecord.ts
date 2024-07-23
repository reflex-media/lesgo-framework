import { PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
import putRecordService, {
  Item,
} from '../../services/DynamoDbService/putRecord';

const putRecord = async (
  item: Item,
  tableAlias: string,
  opts?: PutCommandInput,
  clientOpts?: ClientOptions
) => {
  return putRecordService(item, tableAlias, opts, clientOpts);
};

export default putRecord;
