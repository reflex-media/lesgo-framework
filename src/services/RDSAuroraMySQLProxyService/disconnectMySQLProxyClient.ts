import { logger } from 'src/utils';
import { singleton } from '../RDSAuroraMySQLProxyService/getMySQLProxyClient';

const FILE =
  'lesgo.services.RDSAuroraMySQLProxyService.disconnectMySQLProxyClient';

const disconnectMySQLProxyClient = async () => {
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
