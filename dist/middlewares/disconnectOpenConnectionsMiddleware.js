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
// import { singleton as rdsAuroraMySQLProxySingleton } from '../services/RDSAuroraMySQLProxyService/getMySQLProxyClient';
import disconnectMySQLProxyClient from '../services/RDSAuroraMySQLProxyService/disconnectMySQLProxyClient';
const FILE = 'lesgo.middlewares.disconnectOpenConnectionsMiddleware';
const disconnectOpenConnectionsMiddleware = opts => {
  const disconnectOpenConnections = () =>
    __awaiter(void 0, void 0, void 0, function* () {
      logger.debug(`${FILE}::PREPARING_TO_DISCONNECT`);
      const disconnect = [];
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
        const results = yield Promise.allSettled(disconnect);
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
    });
  const disconnectOpenConnectionsMiddlewareAfter = () =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield disconnectOpenConnections();
    });
  const disconnectOpenConnectionsMiddlewareOnError = () =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield disconnectOpenConnections();
    });
  return {
    after: disconnectOpenConnectionsMiddlewareAfter,
    onError: disconnectOpenConnectionsMiddlewareOnError,
  };
};
export default disconnectOpenConnectionsMiddleware;
