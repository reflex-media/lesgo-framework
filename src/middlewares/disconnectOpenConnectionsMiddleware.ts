import logger from '../utils/logger';
// import { getClientSingleton as getMemcacheClientSingleton } from '../services/MemcacheElastiCacheService/getClient';
// import { disconnect as disconnectMemcacheClient } from '../services/MemcacheElastiCacheService';

const FILE = 'lesgo.middlewares.disconnectOpenConnectionsMiddleware';

export interface invokeCommandMiddlewareOptions {
  [key: string]: any;
}

// FIXME: This function is not disconnecting any open connections
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

    if (disconnect.length > 0) {
      await Promise.all(disconnect);
      logger.debug(`${FILE}::ALL_OPEN_CONNECTIONS_DISCONNECTED`, opts);
    }
  };

  const disconnectOpenConnectionsMiddlewareAfter = async () => {
    await disconnectOpenConnections();
    logger.debug(`${FILE}::ALL_OPEN_CONNECTIONS_DISCONNECTED_AFTER`, opts);
  };

  const disconnectOpenConnectionsMiddlewareOnError = async () => {
    await disconnectOpenConnections();
    logger.debug(`${FILE}::ALL_OPEN_CONNECTIONS_DISCONNECTED_ON_ERROR`, opts);
  };

  return {
    after: disconnectOpenConnectionsMiddlewareAfter,
    onError: disconnectOpenConnectionsMiddlewareOnError,
  };
};

export default disconnectOpenConnectionsMiddleware;
