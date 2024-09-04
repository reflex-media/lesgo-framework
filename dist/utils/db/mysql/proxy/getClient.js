import getClientService from '../../../../services/RDSAuroraMySQLProxyService/getMySQLProxyClient';
const getClient = (connOptions, clientOpts) => {
  return getClientService(connOptions, clientOpts);
};
export default getClient;
