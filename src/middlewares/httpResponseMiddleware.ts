import middy from '@middy/core';
import { LesgoException } from '../exceptions';
import { isEmpty, logger } from '../utils';

const FILE = 'lesgo.middlewares.httpResponseMiddleware';

const defaultOptions = {
  debugMode: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  },
  isBase64Encoded: false,
};

const httpResponseMiddleware = (opts = {}) => {
  const options = { ...defaultOptions, ...opts };

  const httpResponseMiddlewareAfter = async (request: middy.Request) => {
    let body;

    if (options.headers['Content-Type'] !== 'application/json') {
      body = request.response;
    } else {
      body = JSON.stringify({
        status: 'success',
        data: request.response,
        _meta: options.debugMode ? request.event : {},
      });
    }

    const responseData = {
      statusCode: 200,
      headers: {
        ...options.headers,
        ...request.response.headers,
      },
      body,
      isBase64Encoded: options.isBase64Encoded,
    };

    logger.debug(`${FILE}::RESPONSE_DATA_SUCCESS`, responseData);
    request.response = responseData;
  };

  const httpResponseMiddlewareOnError = async (request: middy.Request) => {
    const error = request.error as LesgoException;

    const responseData = {
      statusCode: error.statusCode || 500,
      headers: {
        ...options.headers,
        ...request.response.headers,
      },
      body: JSON.stringify({
        status: 'error',
        data: null,
        error: {
          code: error.code || 'UNHANDLED_ERROR',
          message: error.message || 'Unhandled error occurred',
          details: !isEmpty(error.extra) ? error.extra : error || {},
        },
        _meta: options.debugMode ? request.event : {},
      }),
    };

    logger.debug(`${FILE}::RESPONSE_DATA_ERROR`, responseData);
    request.response = responseData;

    if (isEmpty(error.statusCode) || error.statusCode >= 500) {
      logger.error(error.message, error);
    } else {
      logger.warn(error.message, error);
    }
  };

  return {
    after: httpResponseMiddlewareAfter,
    onError: httpResponseMiddlewareOnError,
  };
};

export default httpResponseMiddleware;
