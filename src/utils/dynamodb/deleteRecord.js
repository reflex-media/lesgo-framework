import config from 'config/aws'; // eslint-disable-line import/no-unresolved
import deleteRecord from '../../services/DynamoDbService/deleteRecord';

export default (tableName, key, { singletonConn = 'default' } = {}) => {
  const { region } = config;

  return deleteRecord(tableName, key, { region, singletonConn });
};
