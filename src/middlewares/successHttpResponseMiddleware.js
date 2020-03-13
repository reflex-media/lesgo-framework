import gzipHttpResponse from './gzipHttpResponse';

export const successHttpResponseHandler = opts => {
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
      ? { ...defaults.headers }
      : {
          ...opts,
          headers: { ...defaults.headers, ...opts.headers },
        };

  const options = { ...defaults, ...optionsHeadersMerged };

  return {
    headers: options.headers,
    statusCode: options.statusCode,
    body: JSON.stringify({
      status: 'success',
      data: options.response,
      _meta: options.debugMode ? options.event : {},
    }),
  };
};

export const successHttpResponseAfterHandler = async (handler, next, opts) => {
  const defaults = {
    response: handler.response,
    event: handler.event,
  };

  const options = { ...defaults, ...opts };

  // eslint-disable-next-line no-param-reassign
  handler.response = successHttpResponseHandler(options);

  // eslint-disable-next-line no-param-reassign
  handler.response = await gzipHttpResponse(handler, opts);

  /* istanbul ignore next */
  next();
};

/**
 * Formats response for successful responses
 */
/* istanbul ignore next */
const successHttpResponseMiddleware = opts => {
  return {
    after: (handler, next) =>
      successHttpResponseAfterHandler(handler, next, opts),
  };
};

export default successHttpResponseMiddleware;
