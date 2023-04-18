import config from 'config/aws'; // eslint-disable-line import/no-unresolved
import put from '../../services/DynamoDbService/put';

export default (tableName, item, { singletonConn = 'default' } = {}) => {
  const { region } = config;

  return put(tableName, item, { region, singletonConn });
};
