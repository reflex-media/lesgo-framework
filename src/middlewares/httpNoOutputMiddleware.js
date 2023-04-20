import app from 'config/app'; // eslint-disable-line import/no-unresolved
import { normalizeHttpRequestBeforeHandler } from './normalizeHttpRequestMiddleware';
import { successHttpResponseHandler } from './successHttpResponseMiddleware';
import { errorHttpResponseHandler } from './errorHttpResponseMiddleware';
import disconnectOpenConnections from './disconnectOpenConnections';
import logger from '../utils/logger';

const FILE = 'lesgo/middlewares/httpNoOutputMiddleware';

const allowResponse = () => {
  return app.debug;
};

const successHttpNoOutputResponseHandler = async opts => {
  const { queryStringParameters } = opts.event;
  const debug = queryStringParameters && queryStringParameters.debug;
  const response = await successHttpResponseHandler(opts);
  const shouldAllowResponse = opts.allowResponse || allowResponse;

  /* istanbul ignore next */
  if (!debug || !shouldAllowResponse(opts)) {
    response.body = '';
  }

  try {
    await disconnectOpenConnections();
  } catch (err) {
    logger.error(`${FILE}::OPEN_CONNECTION_DISCONNECT_FAIL`, err);
  }

  return response;
};

export const successHttpNoOutputResponseAfterHandler = async (
  handler,
  next,
  opts
) => {
  const defaults = {
    response: handler.response,
    event: handler.event,
    allowResponse,
  };
  const options = { ...defaults, ...opts };

  // @see https://middy.js.org/docs/middlewares/do-not-wait-for-empty-event-loop/
  // eslint-disable-next-line no-param-reassign
  handler.context.callbackWaitsForEmptyEventLoop = false;

  // eslint-disable-next-line no-param-reassign
  handler.response = await successHttpNoOutputResponseHandler(options);

  /* istanbul ignore next */
  next();
};

const errorHttpResponseNoOutputHandler = async opts => {
  const { queryStringParameters } = opts.event;
  const debug = queryStringParameters && queryStringParameters.debug;
  const response = await errorHttpResponseHandler({
    ...opts,
    debugMode: opts.debugMode || debug,
  });
  const shouldAllowResponse = opts.allowResponse || allowResponse;

  if (!debug || !shouldAllowResponse(opts)) {
    response.statusCode = 200;
    response.body = '';
  }

  try {
    await disconnectOpenConnections();
  } catch (err) {
    logger.error(`${FILE}::OPEN_CONNECTION_DISCONNECT_FAIL`, err);
  }

  return response;
};

export const errorHttpNoOutputResponseAfterHandler = async (
  handler,
  next,
  opts
) => {
  const defaults = {
    error: handler.error,
    event: handler.event,
    logger: console.error, // eslint-disable-line no-console
    allowResponse,
  };

  const options = { ...defaults, ...opts };

  // @see https://middy.js.org/docs/middlewares/do-not-wait-for-empty-event-loop/
  // eslint-disable-next-line no-param-reassign
  handler.context.callbackWaitsForEmptyEventLoop = false;

  // eslint-disable-next-line no-param-reassign
  handler.response = await errorHttpResponseNoOutputHandler(options);
  /* istanbul ignore next */
  next();
};

/* istanbul ignore next */
const httpNoOutputMiddleware = opts => {
  return {
    before: (handler, next) => normalizeHttpRequestBeforeHandler(handler, next),
    after: (handler, next) =>
      successHttpNoOutputResponseAfterHandler(handler, next, opts),
    onError: (handler, next) =>
      errorHttpNoOutputResponseAfterHandler(handler, next, opts),
  };
};

export default httpNoOutputMiddleware;
