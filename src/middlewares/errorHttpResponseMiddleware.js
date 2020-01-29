import logger from '../utils/logger';

export const errorHttpResponseHandler = opts => {
  const defaults = {
    response: '',
    statusCode: 500,
    event: {},
    debugMode: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    },
    error: '',
  };

  const optionsHeadersMerged =
    opts === undefined
      ? { ...defaults.headers }
      : {
          ...opts,
          headers: { ...defaults.headers, ...opts.headers },
        };

  const options = { ...defaults, ...optionsHeadersMerged };

  const jsonBody = {
    status: 'error',
    data: null,
    error: {
      code: options.error.code || 'UNKNOWN_ERROR',
      message: options.error.name
        ? `${options.error.name}: ${options.error.message}`
        : options.error.message || options.error,
      details: options.error.extra || '',
    },
    _meta: options.debugMode ? options.event : {},
  };

  const statusCode = options.error.statusCode || options.statusCode;

  /* istanbul ignore next */
  if (statusCode === 500) {
    // this is likely an unhandled exception, log it
    logger.error(options.error);
  }

  return {
    headers: options.headers,
    statusCode,
    body: JSON.stringify(jsonBody),
  };
};

export const errorHttpResponseAfterHandler = (handler, next, opts) => {
  const defaults = {
    error: handler.error,
    event: handler.event,
    logger: console.error, // eslint-disable-line no-console
  };

  const options = { ...defaults, ...opts };

  // eslint-disable-next-line no-param-reassign
  handler.response = errorHttpResponseHandler(options);
  /* istanbul ignore next */
  next();
};

/**
 * Formats response for error responses
 */
/* istanbul ignore next */
const errorHttpResponseMiddleware = opts => {
  return {
    onError: (handler, next) =>
      errorHttpResponseAfterHandler(handler, next, opts),
  };
};

export default errorHttpResponseMiddleware;
