import { disconnectMySQLProxyClient } from '../../../../services/RDSAuroraMySQLProxyService';

/**
 * @deprecated Disconnect db is no longer to be used due to the use of ConnectionPool
 */
const disconnectDb = () => {
  return disconnectMySQLProxyClient();
};

export default disconnectDb;
