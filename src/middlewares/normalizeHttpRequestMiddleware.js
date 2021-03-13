import app from 'Config/app'; // eslint-disable-line import/no-unresolved
import getJwtSubFromAuthHeader from '../utils/getJwtSubFromAuthHeader';
import logger from '../utils/logger';

export const normalizeRequest = opts => {
  const { headers, body } = opts;
  let { qs } = opts;
  let input = null;

  // to be consistent with api gateway, we convert empty object to null
  if (JSON.stringify(qs) === '{}') qs = null;

  if (!headers && qs === null) return input;

  if (qs !== null) input = qs;

  const contentType = headers['Content-Type'] || headers['content-type'];

  if (!contentType) return input;

  /* istanbul ignore else */
  if (contentType.startsWith('application/json')) {
    try {
      input = { ...input, ...JSON.parse(body) };
    } catch (err) {
      throw new Error(
        'Content type defined as JSON but an invalid JSON was provided'
      );
    }
  }

  return input;
};

export const normalizeHttpRequestBeforeHandler = (handler, next) => {
  const options = {
    headers: handler.event.headers,
    qs: handler.event.queryStringParameters,
    body: handler.event.body,
  };

  // eslint-disable-next-line no-param-reassign
  handler.event.input = normalizeRequest(options);

  // eslint-disable-next-line no-param-reassign
  handler.event.auth = {};
  if (handler.event.headers.Authorization) {
    // eslint-disable-next-line no-param-reassign
    handler.event.auth = {
      sub: getJwtSubFromAuthHeader(handler.event.headers.Authorization),
    };
  }

  logger.addMeta({
    requestId: handler.event.requestContext
      ? handler.event.requestContext.requestId
      : null,
    tags: {
      path: handler.event.path,
      httpMethod: handler.event.httpMethod,
    },
  });

  if (app.debug) {
    logger.addMeta({
      auth: handler.event.auth,
      queryStringParameters: options.qs,
      body: options.body,
    });
  }

  /* istanbul ignore next */
  next();
};

/**
 * Normalizes handler.event.body and handler.event.queryStringParameters
 * as handler.event.input Object
 */
const normalizeHttpRequestMiddleware /* istanbul ignore next */ = () => {
  return {
    before: (handler, next) => normalizeHttpRequestBeforeHandler(handler, next),
  };
};

export default normalizeHttpRequestMiddleware;
