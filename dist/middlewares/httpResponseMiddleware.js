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
import { isEmpty, logger } from '../utils';
const FILE = 'lesgo.middlewares.httpResponseMiddleware';
const defaultOptions = {
  debugMode: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  },
  isBase64Encoded: false,
};
const httpResponseMiddleware = (opts = {}) => {
  const options = Object.assign(
    Object.assign(Object.assign({}, defaultOptions), opts),
    {
      headers: Object.assign(
        Object.assign({}, defaultOptions.headers),
        opts.headers
      ),
    }
  );
  const httpResponseMiddlewareAfter = request =>
    __awaiter(void 0, void 0, void 0, function* () {
      var _a;
      let body;
      if (options.headers['Content-Type'] !== 'application/json') {
        body = request.response;
      } else {
        body = Object.assign(
          {
            status: 'success',
            data: request.response,
            _meta: options.debugMode ? request.event : {},
          },
          request.event.extendedResponse
        );
      }
      const responseData = {
        statusCode: 200,
        headers: Object.assign(
          Object.assign({}, options.headers),
          (_a = request.response) === null || _a === void 0
            ? void 0
            : _a.headers
        ),
        body,
        isBase64Encoded: options.isBase64Encoded,
      };
      logger.debug(`${FILE}::RESPONSE_DATA_SUCCESS`, responseData);
      request.response = Object.assign(Object.assign({}, responseData), {
        body:
          options.headers['Content-Type'] === 'application/json'
            ? JSON.stringify(responseData.body)
            : responseData.body,
      });
    });
  const httpResponseMiddlewareOnError = request =>
    __awaiter(void 0, void 0, void 0, function* () {
      var _b;
      const error = request.error;
      if (error.extra && error.extra.statusCode) {
        delete error.extra.statusCode;
      }
      const responseData = {
        statusCode: error.statusCode || 500,
        headers: Object.assign(
          Object.assign({}, options.headers),
          (_b = request.response) === null || _b === void 0
            ? void 0
            : _b.headers
        ),
        body: Object.assign(
          {
            status: 'error',
            data: null,
            error: {
              code: error.code || 'UNHANDLED_ERROR',
              message: error.message || 'Unhandled error occurred',
              details: error.extra || {},
            },
            _meta: options.debugMode ? request.event : {},
          },
          request.event.extendedResponse
        ),
      };
      logger.debug(`${FILE}::RESPONSE_DATA_ERROR`, responseData);
      request.response = Object.assign(Object.assign({}, responseData), {
        body: JSON.stringify(responseData.body),
      });
      if (isEmpty(error.statusCode) || error.statusCode >= 500) {
        logger.error(error.message, error);
      } else {
        logger.warn(error.message, error);
      }
    });
  return {
    after: httpResponseMiddlewareAfter,
    onError: httpResponseMiddlewareOnError,
  };
};
export default httpResponseMiddleware;
