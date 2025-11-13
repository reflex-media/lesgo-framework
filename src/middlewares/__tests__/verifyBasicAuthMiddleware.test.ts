import middy from '@middy/core';
import { Context } from 'aws-lambda';
import verifyBasicAuthMiddleware, {
  VerifyBasicAuthMiddlewareOptions,
} from '../verifyBasicAuthMiddleware';
import { LesgoException } from '../../exceptions';
import logger from '../../utils/logger';
import basicAuthConfig from '../../config/basicAuth';

jest.mock('../../utils/logger');

describe('verifyBasicAuthMiddleware', () => {
  const mockRequest: middy.Request = {
    event: {
      headers: {
        authorization: 'Basic am9objpqMDRuRDBl',
      },
    },
    context: {
      awsRequestId: '123',
    } as Context,
    response: {},
    error: null,
    internal: {},
  };

  const mockOptions: VerifyBasicAuthMiddlewareOptions = {
    debugMode: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify the basic auth and set the decoded username in the request event', () => {
    const mockDecoded = {
      username: basicAuthConfig.authorizedList[0].username,
      password: basicAuthConfig.authorizedList[0].password,
    };

    verifyBasicAuthMiddleware(mockOptions).before(mockRequest);

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.middlewares.verifyBasicAuthMiddleware::BASIC_AUTH_TO_VERIFY',
      {
        request: mockRequest,
        options: mockOptions,
      }
    );
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.middlewares.verifyBasicAuthMiddleware::BASIC_AUTH_DECODED',
      mockDecoded
    );
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.middlewares.verifyBasicAuthMiddleware::BASIC_AUTH_VERIFIED'
    );
    expect(mockRequest.event.basicAuth).toEqual({
      username: mockDecoded.username,
    });
  });

  it('should verify the basic auth when no options is set', () => {
    const mockDecoded = {
      username: basicAuthConfig.authorizedList[0].username,
      password: basicAuthConfig.authorizedList[0].password,
    };

    verifyBasicAuthMiddleware().before(mockRequest);

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.middlewares.verifyBasicAuthMiddleware::BASIC_AUTH_TO_VERIFY',
      {
        request: mockRequest,
        options: {},
      }
    );
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.middlewares.verifyBasicAuthMiddleware::BASIC_AUTH_DECODED',
      mockDecoded
    );
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.middlewares.verifyBasicAuthMiddleware::BASIC_AUTH_VERIFIED'
    );
    expect(mockRequest.event.basicAuth).toEqual({
      username: mockDecoded.username,
    });
  });

  it('should throw a LesgoException if there is no basic auth provided', () => {
    mockRequest.event.headers.authorization = undefined;

    expect(() =>
      verifyBasicAuthMiddleware(mockOptions).before(mockRequest)
    ).toThrow(
      new LesgoException(
        'No basic auth provided',
        'lesgo.middlewares.verifyBasicAuthMiddleware::NO_BASIC_AUTH_PROVIDED',
        401
      )
    );
  });

  it('should throw a LesgoException if the basic auth has missing fields', () => {
    mockRequest.event.headers.authorization = 'Basic am9obmRvZQ==';

    expect(() =>
      verifyBasicAuthMiddleware(mockOptions).before(mockRequest)
    ).toThrow(
      new LesgoException(
        'Invalid basic auth due to missing fields',
        'lesgo.middlewares.verifyBasicAuthMiddleware::INVALID_BASIC_AUTH_MISSING_FIELDS',
        401
      )
    );
  });

  it('should throw a LesgoException if the basic auth has no match found', () => {
    mockRequest.event.headers.authorization =
      'Basic aW52YWxpZEtleTppbnZhbGlkVmFsdWU=';

    expect(() =>
      verifyBasicAuthMiddleware(mockOptions).before(mockRequest)
    ).toThrow(
      new LesgoException(
        'Invalid basic auth due to no match found',
        'lesgo.middlewares.verifyBasicAuthMiddleware::INVALID_BASIC_AUTH_NO_MATCH',
        401
      )
    );
  });

  it('should handle basic auth without Basic prefix', () => {
    mockRequest.event.headers.authorization = 'am9objpqMDRuRDBl';

    verifyBasicAuthMiddleware(mockOptions).before(mockRequest);

    expect(mockRequest.event.basicAuth).toEqual({
      username: basicAuthConfig.authorizedList[0].username,
    });
  });

  it('should set extendedResponse with basicAuth in after hook', async () => {
    const mockBasicAuth = {
      username: basicAuthConfig.authorizedList[0].username,
    };
    mockRequest.event.basicAuth = mockBasicAuth;

    const middleware = verifyBasicAuthMiddleware(mockOptions);
    await middleware.after(mockRequest);

    expect(mockRequest.event.extendedResponse).toEqual({
      _basicAuth: mockBasicAuth,
    });
  });

  it('should overwrite extendedResponse in after hook', async () => {
    const mockBasicAuth = {
      username: basicAuthConfig.authorizedList[0].username,
    };
    mockRequest.event.basicAuth = mockBasicAuth;
    mockRequest.event.extendedResponse = {
      _custom: 'value',
    };

    const middleware = verifyBasicAuthMiddleware(mockOptions);
    await middleware.after(mockRequest);

    expect(mockRequest.event.extendedResponse).toEqual({
      _basicAuth: mockBasicAuth,
    });
  });
});
