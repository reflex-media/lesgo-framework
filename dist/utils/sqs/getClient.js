import getClientService from '../../services/SQSService/getClient';
const getClient = clientOpts => {
  return getClientService(clientOpts);
};
export default getClient;
