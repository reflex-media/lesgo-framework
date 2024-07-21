import getClientService, {
  GetClientOptions,
} from '../../services/DynamoDbService/getClient';

const getClient = (opts?: GetClientOptions) => {
  return getClientService(opts);
};

export default getClient;
