var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import logger from '../utils/logger';
// import { getClientSingleton as getMemcacheClientSingleton } from '../services/MemcacheElastiCacheService/getClient';
// import { disconnect as disconnectMemcacheClient } from '../services/MemcacheElastiCacheService';
const FILE = 'lesgo.middlewares.disconnectOpenConnectionsMiddleware';
// FIXME: This function is not disconnecting any open connections
const disconnectOpenConnectionsMiddleware = () => {
  const disconnectOpenConnections = () =>
    __awaiter(void 0, void 0, void 0, function* () {
      logger.debug(`${FILE}::PREPARING_TO_DISCONNECT`);
      // const disconnect: any[] = [];
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
    });
  const disconnectOpenConnectionsMiddlewareAfter = () =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield disconnectOpenConnections();
      logger.debug(`${FILE}::ALL_OPEN_CONNECTIONS_DISCONNECTED_AFTER`);
    });
  const disconnectOpenConnectionsMiddlewareOnError = () =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield disconnectOpenConnections();
      logger.debug(`${FILE}::ALL_OPEN_CONNECTIONS_DISCONNECTED_ON_ERROR`);
    });
  return {
    after: disconnectOpenConnectionsMiddlewareAfter,
    onError: disconnectOpenConnectionsMiddlewareOnError,
  };
};
export default disconnectOpenConnectionsMiddleware;
