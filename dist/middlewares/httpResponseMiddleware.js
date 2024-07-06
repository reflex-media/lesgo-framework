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
const defaultOptions = {
  debugMode: false,
};
const httpResponseMiddleware = (opts = {}) => {
  const options = Object.assign(Object.assign({}, defaultOptions), opts);
  const httpResponseMiddlewareAfter = request =>
    __awaiter(void 0, void 0, void 0, function* () {
      request.response = {
        statusCode: 200,
        headers: Object.assign(Object.assign({}, request.response.headers), {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          status: 'success',
          data: request.response,
          _meta: options.debugMode ? request.event : {},
        }),
      };
    });
  const httpResponseMiddlewareOnError = request =>
    __awaiter(void 0, void 0, void 0, function* () {
      console.log('REQUEST', request);
      console.log('REQUEST_ERROR', request.error);
      const error = request.error;
      request.response = {
        statusCode: error.statusCode || 500,
        headers: Object.assign(Object.assign({}, request.response.headers), {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          status: 'error',
          data: null,
          error: {
            code: error.code || 'UNHANDLED_ERROR',
            message: error.message,
            details: error.extra || {},
          },
          _meta: options.debugMode ? request.event : {},
        }),
      };
    });
  return {
    after: httpResponseMiddlewareAfter,
    onError: httpResponseMiddlewareOnError,
  };
};
export default httpResponseMiddleware;
