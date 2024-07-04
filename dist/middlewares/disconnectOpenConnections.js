Object.defineProperty(exports, '__esModule', { value: true });
const logger_1 = require('../utils/logger');
// import { getClientSingleton as getMemcacheClientSingleton } from '../services/MemcacheElastiCacheService/getClient';
// import { disconnect as disconnectMemcacheClient } from '../services/MemcacheElastiCacheService';
const FILE = 'lesgo/middlewares/disconnectOpenConnections';
// FIXME: This function is not disconnecting any open connections
const disconnectOpenConnections = () => {
  // const disconnect: any[] = [];
  logger_1.default.debug(`${FILE}::PREPARING_DISCONNECT`);
  // const memcacheClientSingleton = getMemcacheClientSingleton();
  // if (Object.keys(memcacheClientSingleton).length > 0) {
  //   Object.keys(memcacheClientSingleton).forEach(singletonConn => {
  //     logger.debug(`${FILE}::PREPARING_DISCONNECT_MEMCACHE`);
  //     disconnect.push(
  //       disconnectMemcacheClient(memcacheClientSingleton[singletonConn])
  //     );
  //   });
  // }
  // if (disconnect.length > 0) {
  //   await Promise.all(disconnect);
  //   logger.debug(`${FILE}::ALL_OPEN_CONNECTIONS_DISCONNECTED`);
  // }
  logger_1.default.debug(`${FILE}::FIXME_NO_OPEN_CONNECTIONS_TO_DISCONNECT`);
};
exports.default = disconnectOpenConnections;
