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
exports.successHttpResponseAfterHandler = exports.successHttpResponseHandler =
  void 0;
const gzipHttpResponse_1 = require('./gzipHttpResponse');
const logger_1 = require('../utils/logger');
const disconnectOpenConnections_1 = require('./disconnectOpenConnections');
const FILE = 'lesgo/middlewares/successHttpResponseMiddleware';
const successHttpResponseHandler = opts =>
  __awaiter(void 0, void 0, void 0, function* () {
    const defaults = {
      response: '',
      statusCode: 200,
      event: {},
      debugMode: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
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
    try {
      yield (0, disconnectOpenConnections_1.default)();
    } catch (err) {
      logger_1.default.error(`${FILE}::OPEN_CONNECTION_DISCONNECT_FAIL`, err);
    }
    return {
      headers: options.headers,
      statusCode: options.statusCode,
      body: JSON.stringify({
        status: 'success',
        data: options.response,
        _meta: options.debugMode ? options.event : {},
      }),
    };
  });
exports.successHttpResponseHandler = successHttpResponseHandler;
/**
 * Formats response for successful responses
 */
const successHttpResponseAfterHandler = (handler, next, opts = {}) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const defaults = {
      response: handler.response,
      event: handler.event,
    };
    const options = Object.assign(Object.assign({}, defaults), opts);
    // @see https://middy.js.org/docs/middlewares/do-not-wait-for-empty-event-loop/
    // eslint-disable-next-line no-param-reassign
    handler.context.callbackWaitsForEmptyEventLoop = false;
    // eslint-disable-next-line no-param-reassign
    handler.response = yield (0, exports.successHttpResponseHandler)(options);
    // eslint-disable-next-line no-param-reassign
    handler.response = yield (0, gzipHttpResponse_1.default)(handler, opts);
    /* istanbul ignore next */
    next();
  });
exports.successHttpResponseAfterHandler = successHttpResponseAfterHandler;
exports.default = exports.successHttpResponseAfterHandler;
