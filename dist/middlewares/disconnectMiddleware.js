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
const FILE = 'lesgo.middlewares.disconnectMiddleware';
const disconnectMiddleware = opts => {
  const disconnect = () =>
    __awaiter(void 0, void 0, void 0, function* () {
      var _a;
      logger.debug(`${FILE}::PREPARING_TO_DISCONNECT`);
      const disconnect = [];
      if (
        (opts === null || opts === void 0 ? void 0 : opts.clients) &&
        ((_a = opts === null || opts === void 0 ? void 0 : opts.clients) ===
          null || _a === void 0
          ? void 0
          : _a.length) > 0
      ) {
        opts.clients.forEach(client => {
          disconnect.push(client());
        });
      }
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
  const disconnectMiddlewareAfter = () =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield disconnect();
    });
  const disconnectMiddlewareOnError = () =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield disconnect();
    });
  return {
    after: disconnectMiddlewareAfter,
    onError: disconnectMiddlewareOnError,
  };
};
export default disconnectMiddleware;
