import config from '../../config/aws';
import putRecordService from '../../services/DynamoDbService/putRecord';
import isEmpty from '../isEmpty';
const putRecord = (
  item,
  tableName,
  { singletonConn = 'default', region = '' } = {}
) => {
  region = isEmpty(region) ? config.dynamodb.region : region;
  return putRecordService(item, tableName, { region, singletonConn });
};
export default putRecord;
