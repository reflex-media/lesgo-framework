import logger from '../utils/logger';
// import { getClientSingleton as getMemcacheClientSingleton } from '../services/MemcacheElastiCacheService/getClient';
// import { disconnect as disconnectMemcacheClient } from '../services/MemcacheElastiCacheService';
// import { singleton as rdsAuroraMySQLProxySingleton } from '../services/RDSAuroraMySQLProxyService/getMySQLProxyClient';
import disconnectMySQLProxyClient from '../services/RDSAuroraMySQLProxyService/disconnectMySQLProxyClient';

const FILE = 'lesgo.middlewares.disconnectOpenConnectionsMiddleware';

export interface invokeCommandMiddlewareOptions {
  [key: string]: any;
}

const disconnectOpenConnectionsMiddleware = (
  opts?: invokeCommandMiddlewareOptions
) => {
  const disconnectOpenConnections = async () => {
    logger.debug(`${FILE}::PREPARING_TO_DISCONNECT`);

    const disconnect: any[] = [];

    // const memcacheClientSingleton = getMemcacheClientSingleton();
    // if (Object.keys(memcacheClientSingleton).length > 0) {
    //   Object.keys(memcacheClientSingleton).forEach(singletonConn => {
    //     logger.debug(`${FILE}::PREPARING_DISCONNECT_MEMCACHE`);
    //     disconnect.push(
    //       disconnectMemcacheClient(memcacheClientSingleton[singletonConn])
    //     );
    //   });
    // }

    // const deleteRdsAuroraMySQLProxySingletonConn: string[] = [];
    // Object.keys(rdsAuroraMySQLProxySingleton).forEach(async singletonConn => {
    //   disconnect.push(rdsAuroraMySQLProxySingleton[singletonConn].end());
    //   deleteRdsAuroraMySQLProxySingletonConn.push(singletonConn);
    // });

    disconnect.push(disconnectMySQLProxyClient());

    if (disconnect.length > 0) {
      const results = await Promise.allSettled(disconnect);

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          logger.debug(`${FILE}::DISCONNECT_SUCCESS`, { result });
        } else if (result.status === 'rejected') {
          logger.error(`${FILE}::DISCONNECT_ERROR`, { result });
        }

        // if (deleteRdsAuroraMySQLProxySingletonConn.length > 0) {
        //   deleteRdsAuroraMySQLProxySingletonConn.forEach(singletonConn => {
        //     delete rdsAuroraMySQLProxySingleton[singletonConn];
        //     logger.debug(`${FILE}::SINGLETON_DELETED`, { singletonConn });
        //   });
        // }
      });

      logger.debug(`${FILE}::DISCONNECT_COMPLETED`, opts);
    }
  };

  const disconnectOpenConnectionsMiddlewareAfter = async () => {
    await disconnectOpenConnections();
  };

  const disconnectOpenConnectionsMiddlewareOnError = async () => {
    await disconnectOpenConnections();
  };

  return {
    after: disconnectOpenConnectionsMiddlewareAfter,
    onError: disconnectOpenConnectionsMiddlewareOnError,
  };
};

export default disconnectOpenConnectionsMiddleware;
