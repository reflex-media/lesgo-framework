import getClientService from '../../services/SecretsManagerService/getClient';
const getClient = clientOpts => {
  return getClientService(clientOpts);
};
export default getClient;
