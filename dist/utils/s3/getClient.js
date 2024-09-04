import getClientService from '../../services/S3Service/getClient';
const getClient = clientOpts => {
  return getClientService(clientOpts);
};
export default getClient;
