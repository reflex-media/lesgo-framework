import middy from '@middy/core';
import { Context } from 'aws-lambda';
import { LesgoException } from '../../exceptions';
import httpResponseMiddleware from '../../middlewares/httpResponseMiddleware';
import logger from '../../utils/logger';

jest.mock('../../utils/logger');

describe('httpResponseMiddleware', () => {
  let request: middy.Request;
  let response: typeof request.response;
  let error: LesgoException;

  beforeEach(() => {
    request = {
      response: {},
      error: null,
      event: {},
      context: {
        awsRequestId: '123',
      } as Context,
      internal: {},
    };
    response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: '',
      isBase64Encoded: false,
    };
    error = new LesgoException('Test error');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return formatted response object by default', async () => {
    request.response = 'Test response';

    const middleware = httpResponseMiddleware();
    await middleware.after(request);

    expect(request.response).toEqual({
      statusCode: 200,
      headers: response.headers,
      body: JSON.stringify({
        status: 'success',
        data: 'Test response',
        _meta: {},
      }),
      isBase64Encoded: false,
    });
  });

  it('should return body as is if Content-Type not application/json', async () => {
    request.response = 'Test response';

    const middleware = httpResponseMiddleware({
      headers: { 'Content-Type': 'text/plain' },
    });
    await middleware.after(request);

    expect(request.response).toEqual({
      statusCode: 200,
      headers: {
        ...response.headers,
        'Content-Type': 'text/plain',
      },
      body: 'Test response',
      isBase64Encoded: false,
    });
  });

  it('should set the response data with default options on error', async () => {
    request.error = error;
    const middleware = httpResponseMiddleware();
    await middleware.onError(request);

    expect(request.response).toEqual({
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'error',
        data: null,
        error: {
          code: 'LESGO_EXCEPTION',
          message: 'Test error',
          details: {},
        },
        _meta: {},
      }),
    });
  });

  it('should set the response data with custom options on error', async () => {
    request.error = new LesgoException('testError', 'TEST_ERROR', 499);

    const middleware = httpResponseMiddleware();
    await middleware.onError(request);

    expect(logger.warn).toHaveBeenCalledWith('testError', request.error);
    expect(request.response).toEqual({
      statusCode: 499,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'error',
        data: null,
        error: {
          code: 'TEST_ERROR',
          message: 'testError',
          details: {},
        },
        _meta: {},
      }),
    });
  });

  it('should remove the extra statusCode if exists', async () => {
    request.error = new LesgoException('testError', 'TEST_ERROR', 599, {
      message: 'internal test error',
      statusCode: 699,
    });

    const customOptions = {
      headers: {
        'Access-Control-Allow-Origin': 'example.com',
        'Cache-Control': 'max-age=3600',
      },
      debugMode: true,
    };

    const middleware = httpResponseMiddleware(customOptions);
    await middleware.onError(request);

    expect(logger.error).toHaveBeenCalledWith('testError', request.error);
    expect(request.response).toEqual({
      statusCode: 599,
      headers: {
        'Access-Control-Allow-Origin': 'example.com',
        'Cache-Control': 'max-age=3600',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'error',
        data: null,
        error: {
          code: 'TEST_ERROR',
          message: 'testError',
          details: {
            message: 'internal test error',
          },
        },
        _meta: {},
      }),
    });
  });

  it('should return with unhaldned error if no error object provided', async () => {
    request.error = new Error();

    const customOptions = {
      debugMode: true,
    };

    const middleware = httpResponseMiddleware(customOptions);
    await middleware.onError(request);

    expect(request.response).toEqual({
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'error',
        data: null,
        error: {
          code: 'UNHANDLED_ERROR',
          message: 'Unhandled error occurred',
          details: {},
        },
        _meta: {},
      }),
    });
  });
});
