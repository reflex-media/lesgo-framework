import middy from '@middy/core';

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
    console.log('Error:', request.error);

    request.response = {
      statusCode: 500,
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
          // FIXME: To add error data from the error object
          // code: options.error.code || 'UNHANDLED_ERROR',
          // message: options.error.name
          //   ? `${options.error.name}: ${options.error.message}`
          //   : options.error.message || options.error,
          // details: options.error.extra || '',
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
