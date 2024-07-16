import config from '../../config/aws';
import putRecordService, {
  Item,
} from '../../services/DynamoDbService/putRecord';
import isEmpty from '../isEmpty';

const putRecord = async (
  item: Item,
  tableName: string,
  { singletonConn = 'default', region = '' } = {}
) => {
  region = isEmpty(region) ? config.dynamodb.region : region;

  return putRecordService(item, tableName, { region, singletonConn });
};

export default putRecord;
