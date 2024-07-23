import getClientService from '../../../services/RDSAuroraMySQLProxyService/getClient';
const getClient = (poolOpts, clientOpts) => {
  return getClientService(poolOpts, clientOpts);
};
export default getClient;
