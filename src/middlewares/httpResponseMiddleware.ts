import middy from '@middy/core';
import { LesgoException } from '../exceptions';
import { isEmpty, logger } from '../utils';
import { HttpMiddlewareOptions } from './httpMiddleware';

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

const httpResponseMiddleware = (opts: HttpMiddlewareOptions = {}) => {
  const options = {
    ...defaultOptions,
    ...opts,
    headers: {
      ...defaultOptions.headers,
      ...opts.headers,
    },
  };

  const httpResponseMiddlewareAfter = async (request: middy.Request) => {
    let body;

    if (options.headers['Content-Type'] !== 'application/json') {
      body = request.response;
    } else {
      body = {
        status: 'success',
        data: request.response,
        _meta: options.debugMode ? request.event : {},
      };
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
    request.response = {
      ...responseData,
      body:
        options.headers['Content-Type'] === 'application/json'
          ? JSON.stringify(responseData.body)
          : responseData.body,
    };
  };

  const httpResponseMiddlewareOnError = async (request: middy.Request) => {
    const error = request.error as LesgoException;

    const responseData = {
      statusCode: error.statusCode || 500,
      headers: {
        ...options.headers,
        ...request.response?.headers,
      },
      body: {
        status: 'error',
        data: null,
        error: {
          code: error.code || 'UNHANDLED_ERROR',
          message: error.message || 'Unhandled error occurred',
          details: error.extra || {},
        },
        _meta: options.debugMode ? request.event : {},
      },
    };

    logger.debug(`${FILE}::RESPONSE_DATA_ERROR`, responseData);
    request.response = {
      ...responseData,
      body: JSON.stringify(responseData.body),
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
