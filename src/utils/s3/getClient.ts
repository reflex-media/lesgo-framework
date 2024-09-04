import getClientService from '../../services/S3Service/getClient';
import { ClientOptions } from '../../types/aws';

const getClient = (clientOpts?: ClientOptions) => {
  return getClientService(clientOpts);
};

export default getClient;
