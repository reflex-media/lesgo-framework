Object.defineProperty(exports, '__esModule', { value: true });
exports.normalizeHttpRequestBeforeHandler =
  exports.normalizeHttpRequestHandler = void 0;
// @ts-ignore
const app_1 = require('config/app');
const getJwtSubFromAuthHeader_1 = require('../utils/getJwtSubFromAuthHeader');
const logger_1 = require('../utils/logger');
const normalizeHttpRequestHandler = opts => {
  const { headers, body } = opts;
  let { qs } = opts;
  let input = null;
  // to be consistent with api gateway, we convert empty object to null
  if (JSON.stringify(qs) === '{}') qs = null;
  if (!headers && qs === null) return input;
  if (qs !== null) input = qs;
  const contentType = headers
    ? headers['Content-Type'] || headers['content-type']
    : null;
  if (!contentType) return input;
  /* istanbul ignore else */
  if (contentType.startsWith('application/json')) {
    try {
      input = Object.assign(Object.assign({}, input), JSON.parse(body || '{}'));
    } catch (err) {
      throw new Error(
        'Content type defined as JSON but an invalid JSON was provided'
      );
    }
  }
  return input;
};
exports.normalizeHttpRequestHandler = normalizeHttpRequestHandler;
/**
 * Normalizes handler.event.body and handler.event.queryStringParameters
 * as handler.event.input Object
 */
const normalizeHttpRequestBeforeHandler = (handler, next) => {
  const options = {
    headers: handler.event.headers,
    qs: handler.event.queryStringParameters,
    body: handler.event.body,
  };
  // @see https://middy.js.org/docs/middlewares/do-not-wait-for-empty-event-loop/
  // eslint-disable-next-line no-param-reassign
  handler.context.callbackWaitsForEmptyEventLoop = false;
  // eslint-disable-next-line no-param-reassign
  handler.event.input = (0, exports.normalizeHttpRequestHandler)(options);
  const authHeader =
    options.headers.Authorization || options.headers.authorization;
  const auth = {};
  if (authHeader) {
    auth.sub = (0, getJwtSubFromAuthHeader_1.default)(authHeader);
  }
  // eslint-disable-next-line no-param-reassign
  handler.event.auth = auth;
  const tags = {};
  switch (handler.event.version) {
    case '2.0': {
      if (
        handler.event.requestContext &&
        'http' in handler.event.requestContext
      ) {
        tags.path = handler.event.requestContext.http.path;
        tags.httpMethod = handler.event.requestContext.http.method;
      }
      break;
    }
    default:
      tags.path = 'path' in handler.event ? handler.event.path : '';
      tags.httpMethod =
        'httpMethod' in handler.event ? handler.event.httpMethod : '';
      break;
  }
  logger_1.default.addMeta({
    requestId: handler.event.requestContext
      ? handler.event.requestContext.requestId
      : null,
    tags,
  });
  if (app_1.default.debug) {
    logger_1.default.addMeta({
      auth: handler.event.auth,
      queryStringParameters: options.qs,
      body: options.body,
    });
  }
  /* istanbul ignore next */
  next();
};
exports.normalizeHttpRequestBeforeHandler = normalizeHttpRequestBeforeHandler;
exports.default = exports.normalizeHttpRequestBeforeHandler;
