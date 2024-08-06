import { logger } from '../../utils';
import { singleton } from '../RDSAuroraMySQLProxyService/getMySQLProxyClient';

const FILE =
  'lesgo.services.RDSAuroraMySQLProxyService.disconnectMySQLProxyClient';

const disconnectMySQLProxyClient = async () => {
  logger.debug(`${FILE}::PREPARING_TO_DISCONNECT`, {
    singletonConns: Object.keys(singleton),
  });

  Object.keys(singleton).forEach(async singletonConn => {
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
