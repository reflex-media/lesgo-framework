import app from 'config/app'; // eslint-disable-line import/no-unresolved
import { normalizeHttpRequestBeforeHandler } from './normalizeHttpRequestMiddleware';
import { successHttpResponseHandler } from './successHttpResponseMiddleware';
import { errorHttpResponseHandler } from './errorHttpResponseMiddleware';

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
