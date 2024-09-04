import getClientService from '../../services/DynamoDbService/getClient';
const getClient = opts => {
  return getClientService(opts);
};
export default getClient;
