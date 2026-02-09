import middy from '@middy/core';
import { Context } from 'aws-lambda';
import httpMiddleware from '../httpMiddleware';
import httpResponseMiddleware from '../httpResponseMiddleware';

jest.mock('../httpResponseMiddleware');

describe('httpMiddleware', () => {
  let request: middy.Request;

  beforeEach(() => {
    request = {
      event: {},
      context: {
        awsRequestId: '123',
      } as Context,
      response: {},
      error: null,
      internal: {},
    };

    (httpResponseMiddleware as jest.Mock).mockReturnValue({
      before: undefined,
      after: jest.fn().mockResolvedValue(undefined),
      onError: jest.fn().mockResolvedValue(undefined),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return middleware with before, after, and onError hooks', () => {
    const middleware = httpMiddleware();
    expect(middleware).toHaveProperty('before');
    expect(middleware).toHaveProperty('after');
    expect(middleware).toHaveProperty('onError');
    expect(middleware.before).toBeInstanceOf(Function);
    expect(middleware.after).toBeInstanceOf(Function);
    expect(middleware.onError).toBeInstanceOf(Function);
  });

  it('should accept options and pass them to httpResponseMiddleware', () => {
    const options = {
      debugMode: true,
      headers: { 'X-Custom': 'value' },
      isBase64Encoded: true,
    };

    httpMiddleware(options);

    expect(httpResponseMiddleware).toHaveBeenCalledWith(options);
  });

  it('should execute before hooks from composed middlewares', async () => {
    const middleware = httpMiddleware();
    await middleware.before(request);

    expect(httpResponseMiddleware).toHaveBeenCalled();
  });

  it('should execute after hooks from composed middlewares', async () => {
    const mockAfter = jest.fn().mockResolvedValue(undefined);
    (httpResponseMiddleware as jest.Mock).mockReturnValue({
      before: undefined,
      after: mockAfter,
      onError: jest.fn().mockResolvedValue(undefined),
    });

    const middleware = httpMiddleware();
    await middleware.after(request);

    expect(mockAfter).toHaveBeenCalledWith(request);
  });

  it('should execute onError hooks from composed middlewares', async () => {
    const mockOnError = jest.fn().mockResolvedValue(undefined);
    (httpResponseMiddleware as jest.Mock).mockReturnValue({
      before: undefined,
      after: jest.fn().mockResolvedValue(undefined),
      onError: mockOnError,
    });

    const middleware = httpMiddleware();
    await middleware.onError(request);

    expect(mockOnError).toHaveBeenCalledWith(request);
  });

  it('should skip hooks that are undefined', async () => {
    (httpResponseMiddleware as jest.Mock).mockReturnValue({
      before: undefined,
      after: undefined,
      onError: undefined,
    });

    const middleware = httpMiddleware();

    await expect(middleware.before(request)).resolves.not.toThrow();
    await expect(middleware.after(request)).resolves.not.toThrow();
    await expect(middleware.onError(request)).resolves.not.toThrow();
  });

  it('should handle errors in before hook', async () => {
    const mockError = new Error('Before hook error');
    const mockBefore = jest.fn().mockRejectedValue(mockError);
    (httpResponseMiddleware as jest.Mock).mockReturnValue({
      before: mockBefore,
      after: jest.fn().mockResolvedValue(undefined),
      onError: jest.fn().mockResolvedValue(undefined),
    });

    const middleware = httpMiddleware();

    await expect(middleware.before(request)).rejects.toThrow(
      'Before hook error'
    );
  });

  it('should handle errors in after hook', async () => {
    const mockError = new Error('After hook error');
    const mockAfter = jest.fn().mockRejectedValue(mockError);
    (httpResponseMiddleware as jest.Mock).mockReturnValue({
      before: undefined,
      after: mockAfter,
      onError: jest.fn().mockResolvedValue(undefined),
    });

    const middleware = httpMiddleware();

    await expect(middleware.after(request)).rejects.toThrow('After hook error');
  });

  it('should handle errors in onError hook', async () => {
    const mockError = new Error('OnError hook error');
    const mockOnError = jest.fn().mockRejectedValue(mockError);
    (httpResponseMiddleware as jest.Mock).mockReturnValue({
      before: undefined,
      after: jest.fn().mockResolvedValue(undefined),
      onError: mockOnError,
    });

    const middleware = httpMiddleware();

    await expect(middleware.onError(request)).rejects.toThrow(
      'OnError hook error'
    );
  });

  it('should work with empty options', () => {
    const middleware = httpMiddleware({});
    expect(middleware).toHaveProperty('before');
    expect(middleware).toHaveProperty('after');
    expect(middleware).toHaveProperty('onError');
  });
});
