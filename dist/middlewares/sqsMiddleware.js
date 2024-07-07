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
import eventNormalizer from '@middy/event-normalizer';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import disconnectOpenConnectionsMiddleware from './disconnectOpenConnectionsMiddleware';
const httpMiddleware = () => {
  const middlewarePackages = [
    doNotWaitForEmptyEventLoop(),
    eventNormalizer(),
    disconnectOpenConnectionsMiddleware(),
  ];
  return {
    before: handler =>
      __awaiter(void 0, void 0, void 0, function* () {
        for (const middleware of middlewarePackages) {
          if (middleware.before) {
            yield middleware.before(handler);
          }
        }
      }),
    after: handler =>
      __awaiter(void 0, void 0, void 0, function* () {
        for (const middleware of middlewarePackages) {
          if (middleware.after) {
            yield middleware.after(handler);
          }
        }
      }),
    onError: handler =>
      __awaiter(void 0, void 0, void 0, function* () {
        for (const middleware of middlewarePackages) {
          if (middleware.onError) {
            yield middleware.onError(handler);
          }
        }
      }),
  };
};
export default httpMiddleware;
