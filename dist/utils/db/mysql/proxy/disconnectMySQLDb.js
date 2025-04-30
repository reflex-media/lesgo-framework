import { disconnectMySQLClient } from '../../../../services/RDSAuroraMySQLProxyService';
/**
 * @deprecated Disconnect db is no longer to be used due to the use of ConnectionPool
 */
const disconnectMySQLDb = () => {
  return disconnectMySQLClient();
};
export default disconnectMySQLDb;
