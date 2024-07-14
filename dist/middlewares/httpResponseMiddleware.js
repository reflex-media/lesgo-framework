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
  const options = Object.assign(Object.assign({}, defaultOptions), opts);
  const httpResponseMiddlewareAfter = request =>
    __awaiter(void 0, void 0, void 0, function* () {
      let body;
      if (options.headers['Content-Type'] !== 'application/json') {
        body = request.response;
      } else {
        body = JSON.stringify({
          status: 'success',
          data: request.response,
          _meta: options.debugMode ? request.event : {},
        });
      }
      const responseData = {
        statusCode: 200,
        headers: Object.assign(
          Object.assign({}, options.headers),
          request.response.headers
        ),
        body,
        isBase64Encoded: options.isBase64Encoded,
      };
      logger.debug(`${FILE}::RESPONSE_DATA_SUCCESS`, responseData);
      request.response = responseData;
    });
  const httpResponseMiddlewareOnError = request =>
    __awaiter(void 0, void 0, void 0, function* () {
      const error = request.error;
      const responseData = {
        statusCode: error.statusCode || 500,
        headers: Object.assign(
          Object.assign({}, options.headers),
          request.response.headers
        ),
        body: JSON.stringify({
          status: 'error',
          data: null,
          error: {
            code: error.code || 'UNHANDLED_ERROR',
            message: error.message || 'Unhandled error occurred',
            details: !isEmpty(error.extra) ? error.extra : error || {},
          },
          _meta: options.debugMode ? request.event : {},
        }),
      };
      logger.debug(`${FILE}::RESPONSE_DATA_ERROR`, responseData);
      request.response = responseData;
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
