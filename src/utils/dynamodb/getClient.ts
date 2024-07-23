import getClientService from '../../services/DynamoDbService/getClient';
import { ClientOptions } from '../../types/aws';

const getClient = (opts?: ClientOptions) => {
  return getClientService(opts);
};

export default getClient;
