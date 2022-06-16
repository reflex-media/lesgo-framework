import gzipHttpResponse from './gzipHttpResponse';
import isEmpty from '../utils/isEmpty';
import logger from '../utils/logger';

const FILE = 'Lesgo/middlewares/successHttpResponseMiddleware';

export const successHttpResponseHandler = async opts => {
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

  try {
    const disconnect = [];
    if (!isEmpty(opts.cache)) disconnect.push(opts.cache.end());
    if (!isEmpty(opts.db)) disconnect.push(opts.db.end());
    if (!isEmpty(opts.dbRead)) disconnect.push(opts.dbRead.end());

    if (disconnect.length > 0) {
      await Promise.all(disconnect);
    }
  } catch (err) {
    logger.error(`${FILE}::Failed to end connection`, err);
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
};

export const successHttpResponseAfterHandler = async (handler, next, opts) => {
  const defaults = {
    response: handler.response,
    event: handler.event,
  };

  const options = { ...defaults, ...opts };

  // eslint-disable-next-line no-param-reassign
  handler.response = await successHttpResponseHandler(options);

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
