import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import gzipHttpResponse from './gzipHttpResponse';
import logger from '../utils/logger';
import disconnectOpenConnections from './disconnectOpenConnections';

const FILE = 'lesgo/middlewares/successHttpResponseMiddleware';

export interface SuccessHttpResponseHandler {
  event: APIGatewayProxyEvent;
  context: Context;
  response: APIGatewayProxyResult;
}

interface Options {
  headers?: Record<string, string>;
  response?: any;
  statusCode?: number;
  event?: Record<string, any>;
  debugMode?: boolean;
  zipWhenRequest?: string[];
}

export const successHttpResponseHandler = async (opts: Options) => {
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
    await disconnectOpenConnections();
  } catch (err) {
    logger.error(`${FILE}::OPEN_CONNECTION_DISCONNECT_FAIL`, err);
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

/**
 * Formats response for successful responses
 */
export const successHttpResponseAfterHandler = async (
  handler: SuccessHttpResponseHandler,
  next: (error?: any) => void,
  opts: Options = {}
) => {
  const defaults = {
    response: handler.response,
    event: handler.event,
  };

  const options = { ...defaults, ...opts };

  // @see https://middy.js.org/docs/middlewares/do-not-wait-for-empty-event-loop/
  // eslint-disable-next-line no-param-reassign
  handler.context.callbackWaitsForEmptyEventLoop = false;

  // eslint-disable-next-line no-param-reassign
  handler.response = await successHttpResponseHandler(options);

  // eslint-disable-next-line no-param-reassign
  handler.response = await gzipHttpResponse(handler, opts);

  /* istanbul ignore next */
  next();
};

export default successHttpResponseAfterHandler;
