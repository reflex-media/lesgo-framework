import { APIGatewayProxyResult, Context } from 'aws-lambda';
import logger from '../utils/logger';
import isEmpty from '../utils/isEmpty';
import disconnectOpenConnections from './disconnectOpenConnections';

const FILE = 'lesgo/middlewares/errorHttpResponseMiddleware';

interface Options {
  response?: any;
  statusCode?: number;
  event?: Record<string, any>;
  debugMode?: boolean;
  headers?: Record<string, string>;
  error?: any;
  formatError?: (options: Options) => string;
}

export interface ErrorHttpResponseHandler {
  event: Record<string, any>;
  context: Context;
  error?: Error;
  response: APIGatewayProxyResult;
}

export const errorHttpResponseHandler = async (opts: Options) => {
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
      code: options.error.code || 'UNHANDLED_ERROR',
      message: options.error.name
        ? `${options.error.name}: ${options.error.message}`
        : options.error.message || options.error,
      details: options.error.extra || '',
    },
    _meta: options.debugMode ? options.event : {},
  };

  const statusCode = options.error.statusCode || options.statusCode;

  if (!isEmpty(options.error)) {
    logger.log(statusCode === 500 ? 'error' : 'warn', options.error);
  } else {
    logger.log(statusCode === 500 ? 'error' : 'warn', jsonBody.error.message, {
      error: jsonBody.error,
    });
  }

  try {
    await disconnectOpenConnections();
  } catch (err: any) {
    logger.error(`${FILE}::OPEN_CONNECTION_DISCONNECT_FAIL`, err);
  }

  return {
    headers: options.headers,
    statusCode,
    body: JSON.stringify(jsonBody),
  };
};

/**
 * Formats response for error responses
 */
export const errorHttpResponseOnErrorHandler = async (
  handler: ErrorHttpResponseHandler,
  next: (error?: any) => void,
  opts: Options = {}
) => {
  const defaults = {
    error: handler.error,
    event: handler.event,
    logger: console.error, // eslint-disable-line no-console
  };

  const options = { ...defaults, ...opts };

  // @see https://middy.js.org/docs/middlewares/do-not-wait-for-empty-event-loop/
  // eslint-disable-next-line no-param-reassign
  handler.context.callbackWaitsForEmptyEventLoop = false;

  // eslint-disable-next-line no-param-reassign
  handler.response = await errorHttpResponseHandler(options);

  /* istanbul ignore next */
  next();
};

export default errorHttpResponseOnErrorHandler;
