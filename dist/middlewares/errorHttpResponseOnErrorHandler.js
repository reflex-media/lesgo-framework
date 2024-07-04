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
Object.defineProperty(exports, '__esModule', { value: true });
exports.errorHttpResponseOnErrorHandler = exports.errorHttpResponseHandler =
  void 0;
const logger_1 = require('../utils/logger');
const isEmpty_1 = require('../utils/isEmpty');
const disconnectOpenConnections_1 = require('./disconnectOpenConnections');
const FILE = 'lesgo/middlewares/errorHttpResponseMiddleware';
const errorHttpResponseHandler = opts =>
  __awaiter(void 0, void 0, void 0, function* () {
    const defaults = {
      response: '',
      statusCode: 500,
      event: {},
      debugMode: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
      error: '',
    };
    const optionsHeadersMerged =
      opts === undefined
        ? Object.assign({}, defaults.headers)
        : Object.assign(Object.assign({}, opts), {
            headers: Object.assign(
              Object.assign({}, defaults.headers),
              opts.headers
            ),
          });
    const options = Object.assign(
      Object.assign({}, defaults),
      optionsHeadersMerged
    );
    const jsonBody = {
      status: 'error',
      data: null,
      error: {
        code: options.error.code || 'UNHANDLED_ERROR',
        message: options.error.name
          ? `${options.error.name}: ${options.error.message}`
          : options.error.message || options.error,
        details: options.error.extra || '',
      },
      _meta: options.debugMode ? options.event : {},
    };
    const statusCode = options.error.statusCode || options.statusCode;
    if (!(0, isEmpty_1.default)(options.error)) {
      logger_1.default.log(
        statusCode === 500 ? 'error' : 'warn',
        options.error
      );
    } else {
      logger_1.default.log(
        statusCode === 500 ? 'error' : 'warn',
        jsonBody.error.message,
        {
          error: jsonBody.error,
        }
      );
    }
    try {
      yield (0, disconnectOpenConnections_1.default)();
    } catch (err) {
      logger_1.default.error(`${FILE}::OPEN_CONNECTION_DISCONNECT_FAIL`, err);
    }
    return {
      headers: options.headers,
      statusCode,
      body: JSON.stringify(jsonBody),
    };
  });
exports.errorHttpResponseHandler = errorHttpResponseHandler;
/**
 * Formats response for error responses
 */
const errorHttpResponseOnErrorHandler = (handler_1, next_1, ...args_1) =>
  __awaiter(
    void 0,
    [handler_1, next_1, ...args_1],
    void 0,
    function* (handler, next, opts = {}) {
      const defaults = {
        error: handler.error,
        event: handler.event,
        logger: console.error, // eslint-disable-line no-console
      };
      const options = Object.assign(Object.assign({}, defaults), opts);
      // @see https://middy.js.org/docs/middlewares/do-not-wait-for-empty-event-loop/
      // eslint-disable-next-line no-param-reassign
      handler.context.callbackWaitsForEmptyEventLoop = false;
      // eslint-disable-next-line no-param-reassign
      handler.response = yield (0, exports.errorHttpResponseHandler)(options);
      /* istanbul ignore next */
      next();
    }
  );
exports.errorHttpResponseOnErrorHandler = errorHttpResponseOnErrorHandler;
exports.default = exports.errorHttpResponseOnErrorHandler;
