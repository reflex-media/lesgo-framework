import middy from '@middy/core';
import { LesgoException } from '../exceptions';
import { isEmpty } from '../utils';

const defaultOptions = {
  debugMode: false,
};

const httpResponseMiddleware = (opts = {}) => {
  const options = { ...defaultOptions, ...opts };

  const httpResponseMiddlewareAfter = async (request: middy.Request) => {
    request.response = {
      statusCode: 200,
      headers: {
        ...request.response.headers,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
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
        ...request.response.headers,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
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
  };

  return {
    after: httpResponseMiddlewareAfter,
    onError: httpResponseMiddlewareOnError,
  };
};

export default httpResponseMiddleware;
