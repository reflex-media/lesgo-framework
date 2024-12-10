import { logger } from '../../utils';

const FILE =
  'lesgo.services.RDSAuroraMySQLProxyService.disconnectMySQLProxyClient';

// @deprecated Disconnect db is no longer to be used due to the use of ConnectionPool
const disconnectMySQLProxyClient = async () => {
  logger.warn(`${FILE}::DEPRECATED_FUNCTION_DO_NOT_END_POOL_CONNECTION`);

  // const singletonConns = Object.keys(singleton);
  // if (singletonConns.length === 0) {
  //   logger.debug(`${FILE}::NO_CONNECTIONS_TO_DISCONNECT`);
  //   return;
  // }

  // logger.debug(`${FILE}::PREPARING_TO_DISCONNECT`, {
  //   singletonConns,
  // });

  // singletonConns.forEach(async singletonConn => {
  //   try {
  //     await singleton[singletonConn].end();
  //     delete singleton[singletonConn];
  //     logger.debug(`${FILE}::COMPLETED`, { singletonConn });
  //   } catch (err) {
  //     logger.error(`${FILE}::ERROR`, { singletonConn, err });
  //   }
  // });
};

export default disconnectMySQLProxyClient;
