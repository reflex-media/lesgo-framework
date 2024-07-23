import getClientService from '../../services/SecretsManagerService/getClient';
import { ClientOptions } from '../../types/aws';

const getClient = (clientOpts?: ClientOptions) => {
  return getClientService(clientOpts);
};

export default getClient;
