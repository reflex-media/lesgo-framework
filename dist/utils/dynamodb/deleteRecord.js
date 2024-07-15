import config from '../../config/aws';
import deleteRecordService from '../../services/DynamoDbService/deleteRecord';
import isEmpty from '../isEmpty';
const deleteRecord = (
  key,
  tableName,
  { singletonConn = 'default', region = '' } = {}
) => {
  region = isEmpty(region) ? config.dynamodb.region : region;
  return deleteRecordService(key, tableName, { region, singletonConn });
};
export default deleteRecord;
