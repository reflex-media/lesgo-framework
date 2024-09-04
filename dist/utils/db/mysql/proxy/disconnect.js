import { disconnectMySQLProxyClient } from '../../../../services/RDSAuroraMySQLProxyService';
const disconnect = () => {
  return disconnectMySQLProxyClient();
};
export default disconnect;
