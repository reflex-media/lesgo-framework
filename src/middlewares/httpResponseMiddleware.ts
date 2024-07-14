import middy from '@middy/core';
import { LesgoException } from '../exceptions';
import { isEmpty, logger } from '../utils';

const defaultOptions = {
  debugMode: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  },
};

const httpResponseMiddleware = (opts = {}) => {
  const options = { ...defaultOptions, ...opts };

  const httpResponseMiddlewareAfter = async (request: middy.Request) => {
    request.response = {
      statusCode: 200,
      headers: {
        ...options.headers,
        ...request.response.headers,
      },
      body: JSON.stringify({
        status: 'success',
        data: request.response,
        _meta: options.debugMode ? request.event : {},
      }),
    };
  };

  const httpResponseMiddlewareOnError = async (request: middy.Request) => {
    const error = request.error as LesgoException;

    request.response = {
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
