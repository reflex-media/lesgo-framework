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
import jsonBodyParser from '@middy/http-json-body-parser';
import eventNormalizer from '@middy/http-event-normalizer';
import errorHandler from '@middy/http-error-handler';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpResponseMiddleware from './httpResponseMiddleware';
const httpMiddleware = (opts = {}) => {
  const middlewarePackages = [
    doNotWaitForEmptyEventLoop(),
    eventNormalizer(),
    errorHandler(),
    httpHeaderNormalizer(),
    jsonBodyParser({ disableContentTypeError: true }),
    httpResponseMiddleware(opts),
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
