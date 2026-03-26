import middy from '@middy/core';
import { Context } from 'aws-lambda';
import invokeCommandMiddleware from '../invokeCommandMiddleware';
import disconnectMiddleware from '../disconnectMiddleware';

jest.mock('../disconnectMiddleware');

describe('invokeCommandMiddleware', () => {
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

    (disconnectMiddleware as jest.Mock).mockReturnValue({
      before: undefined,
      after: jest.fn().mockResolvedValue(undefined),
      onError: jest.fn().mockResolvedValue(undefined),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return middleware with before, after, and onError hooks', () => {
    const middleware = invokeCommandMiddleware();
    expect(middleware).toHaveProperty('before');
    expect(middleware).toHaveProperty('after');
    expect(middleware).toHaveProperty('onError');
    expect(middleware.before).toBeInstanceOf(Function);
    expect(middleware.after).toBeInstanceOf(Function);
    expect(middleware.onError).toBeInstanceOf(Function);
  });

  it('should accept options and pass them to disconnectMiddleware', () => {
    const options = {
      clients: [jest.fn()],
      debugMode: true,
    };

    invokeCommandMiddleware(options);

    expect(disconnectMiddleware).toHaveBeenCalledWith(options);
  });

  it('should execute before hooks from composed middlewares', async () => {
    const mockBefore = jest.fn().mockResolvedValue(undefined);
    (disconnectMiddleware as jest.Mock).mockReturnValue({
      before: mockBefore,
      after: jest.fn().mockResolvedValue(undefined),
      onError: jest.fn().mockResolvedValue(undefined),
    });

    const middleware = invokeCommandMiddleware();
    await middleware.before(request);

    expect(disconnectMiddleware).toHaveBeenCalled();
  });

  it('should execute after hooks from composed middlewares', async () => {
    const mockAfter = jest.fn().mockResolvedValue(undefined);
    (disconnectMiddleware as jest.Mock).mockReturnValue({
      before: undefined,
      after: mockAfter,
      onError: jest.fn().mockResolvedValue(undefined),
    });

    const middleware = invokeCommandMiddleware();
    await middleware.after(request);

    expect(mockAfter).toHaveBeenCalledWith(request);
  });

  it('should execute onError hooks from composed middlewares', async () => {
    const mockOnError = jest.fn().mockResolvedValue(undefined);
    (disconnectMiddleware as jest.Mock).mockReturnValue({
      before: undefined,
      after: jest.fn().mockResolvedValue(undefined),
      onError: mockOnError,
    });

    const middleware = invokeCommandMiddleware();
    await middleware.onError(request);

    expect(mockOnError).toHaveBeenCalledWith(request);
  });

  it('should skip hooks that are undefined', async () => {
    (disconnectMiddleware as jest.Mock).mockReturnValue({
      before: undefined,
      after: undefined,
      onError: undefined,
    });

    const middleware = invokeCommandMiddleware();

    await expect(middleware.before(request)).resolves.not.toThrow();
    await expect(middleware.after(request)).resolves.not.toThrow();
    await expect(middleware.onError(request)).resolves.not.toThrow();
  });

  it('should handle errors in before hook', async () => {
    const mockError = new Error('Before hook error');
    const mockBefore = jest.fn().mockRejectedValue(mockError);
    (disconnectMiddleware as jest.Mock).mockReturnValue({
      before: mockBefore,
      after: jest.fn().mockResolvedValue(undefined),
      onError: jest.fn().mockResolvedValue(undefined),
    });

    const middleware = invokeCommandMiddleware();

    await expect(middleware.before(request)).rejects.toThrow(
      'Before hook error'
    );
  });

  it('should handle errors in after hook', async () => {
    const mockError = new Error('After hook error');
    const mockAfter = jest.fn().mockRejectedValue(mockError);
    (disconnectMiddleware as jest.Mock).mockReturnValue({
      before: undefined,
      after: mockAfter,
      onError: jest.fn().mockResolvedValue(undefined),
    });

    const middleware = invokeCommandMiddleware();

    await expect(middleware.after(request)).rejects.toThrow('After hook error');
  });

  it('should handle errors in onError hook', async () => {
    const mockError = new Error('OnError hook error');
    const mockOnError = jest.fn().mockRejectedValue(mockError);
    (disconnectMiddleware as jest.Mock).mockReturnValue({
      before: undefined,
      after: jest.fn().mockResolvedValue(undefined),
      onError: mockOnError,
    });

    const middleware = invokeCommandMiddleware();

    await expect(middleware.onError(request)).rejects.toThrow(
      'OnError hook error'
    );
  });

  it('should work with empty options', () => {
    const middleware = invokeCommandMiddleware({});
    expect(middleware).toHaveProperty('before');
    expect(middleware).toHaveProperty('after');
    expect(middleware).toHaveProperty('onError');
  });
});
