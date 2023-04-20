import logger from '../utils/logger';
import { getClientSingleton as getMemcacheClientSingleton } from '../services/MemcacheElastiCacheService/getClient';
import { disconnect as disconnectMemcacheClient } from '../services/MemcacheElastiCacheService';

const FILE = 'Lesgo/middlewares/disconnectOpenConnections';

export default async () => {
  const disconnect = [];

  const memcacheClientSingleton = getMemcacheClientSingleton();
  if (Object.keys(memcacheClientSingleton).length > 0) {
    Object.keys(memcacheClientSingleton).forEach(singletonConn => {
      logger.debug(`${FILE}::PREPARING_DISCONNECT_MEMCACHE`);
      disconnect.push(
        disconnectMemcacheClient(memcacheClientSingleton[singletonConn])
      );
    });
  }

  if (disconnect.length > 0) {
    await Promise.all(disconnect);
    logger.debug(`${FILE}::ALL_OPEN_CONNECTIONS_DISCONNECTED`);
  }
};
