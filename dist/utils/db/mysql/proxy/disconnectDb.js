import { disconnectMySQLProxyClient } from '../../../../services/RDSAuroraMySQLProxyService';
const disconnectDb = () => {
  return disconnectMySQLProxyClient();
};
export default disconnectDb;
