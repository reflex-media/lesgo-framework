import getClientService from '../../../services/RDSAuroraMySQLProxyService/getClient';
const getClient = (connOptions, clientOpts) => {
  return getClientService(connOptions, clientOpts);
};
export default getClient;
