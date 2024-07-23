import getClientService from '../../services/SQSService/getClient';
import { ClientOptions } from '../../types/aws';

const getClient = (clientOpts?: ClientOptions) => {
  return getClientService(clientOpts);
};

export default getClient;
