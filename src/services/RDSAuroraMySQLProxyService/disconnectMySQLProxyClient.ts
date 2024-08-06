import { logger } from '../../utils';
import { singleton } from '../RDSAuroraMySQLProxyService/getMySQLProxyClient';

const FILE =
  'lesgo.services.RDSAuroraMySQLProxyService.disconnectMySQLProxyClient';

const disconnectMySQLProxyClient = async () => {
  const singletonConns = Object.keys(singleton);
  if (singletonConns.length === 0) {
    logger.debug(`${FILE}::NO_CONNECTIONS_TO_DISCONNECT`);
    return;
  }

  logger.debug(`${FILE}::PREPARING_TO_DISCONNECT`, {
    singletonConns,
  });

  singletonConns.forEach(async singletonConn => {
    try {
      await singleton[singletonConn].end();
      delete singleton[singletonConn];
      logger.debug(`${FILE}::COMPLETED`, { singletonConn });
    } catch (err) {
      logger.error(`${FILE}::ERROR`, { singletonConn, err });
    }
  });
};

export default disconnectMySQLProxyClient;
