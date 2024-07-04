Object.defineProperty(exports, '__esModule', { value: true });
const normalizeHttpRequestBeforeHandler_1 = require('./normalizeHttpRequestBeforeHandler');
const successHttpResponseAfterHandler_1 = require('./successHttpResponseAfterHandler');
const errorHttpResponseOnErrorHandler_1 = require('./errorHttpResponseOnErrorHandler');
/**
 * Combines all http middlewares into a single middleware
 */
/* istanbul ignore next */
const httpMiddleware = opts => {
  return {
    before: (handler, next) =>
      (0, normalizeHttpRequestBeforeHandler_1.default)(handler, next),
    after: (handler, next) =>
      (0, successHttpResponseAfterHandler_1.default)(handler, next, opts),
    onError: (handler, next) =>
      (0, errorHttpResponseOnErrorHandler_1.default)(handler, next, opts),
  };
};
exports.default = httpMiddleware;
