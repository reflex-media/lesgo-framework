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
// import disconnectMySQLProxyClient from '../services/RDSAuroraMySQLProxyService/disconnectMySQLProxyClient';
// import disconnectElastiCacheRedisClient from '../services/ElastiCacheRedisService/disconnectElastiCacheRedisClient';
const FILE = 'lesgo.middlewares.disconnectOpenConnectionsMiddleware';
const disconnectOpenConnectionsMiddleware = opts => {
  const disconnectOpenConnections = () =>
    __awaiter(void 0, void 0, void 0, function* () {
      var _a;
      logger.debug(`${FILE}::PREPARING_TO_DISCONNECT`);
      const disconnect = [];
      if (
        (opts === null || opts === void 0
          ? void 0
          : opts.disconnectClientServices) &&
        ((_a =
          opts === null || opts === void 0
            ? void 0
            : opts.disconnectClientServices) === null || _a === void 0
          ? void 0
          : _a.length) > 0
      ) {
        opts.disconnectClientServices.forEach(service => {
          disconnect.push(service());
        });
      }
      // disconnect.push(disconnectMySQLProxyClient());
      // disconnect.push(disconnectElastiCacheRedisClient());
      if (disconnect.length > 0) {
        const results = yield Promise.allSettled(disconnect);
        results.forEach(result => {
          if (result.status === 'fulfilled') {
            logger.debug(`${FILE}::DISCONNECT_SUCCESS`, { result });
          } else if (result.status === 'rejected') {
            logger.error(`${FILE}::DISCONNECT_ERROR`, { result });
          }
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
