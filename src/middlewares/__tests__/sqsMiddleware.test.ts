import middy from '@middy/core';
import { Context } from 'aws-lambda';
import sqsMiddleware from '../sqsMiddleware';
import disconnectMiddleware from '../disconnectMiddleware';

jest.mock('../disconnectMiddleware');

describe('sqsMiddleware', () => {
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
    const middleware = sqsMiddleware();
    expect(middleware).toHaveProperty('before');
    expect(middleware).toHaveProperty('after');
    expect(middleware).toHaveProperty('onError');
    expect(middleware.before).toBeInstanceOf(Function);
    expect(middleware.after).toBeInstanceOf(Function);
    expect(middleware.onError).toBeInstanceOf(Function);
  });

  it('should execute before hooks from composed middlewares', async () => {
    const mockBefore = jest.fn().mockResolvedValue(undefined);
    (disconnectMiddleware as jest.Mock).mockReturnValue({
      before: mockBefore,
      after: jest.fn().mockResolvedValue(undefined),
      onError: jest.fn().mockResolvedValue(undefined),
    });

    const middleware = sqsMiddleware();
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

    const middleware = sqsMiddleware();
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

    const middleware = sqsMiddleware();
    await middleware.onError(request);

    expect(mockOnError).toHaveBeenCalledWith(request);
  });

  it('should skip hooks that are undefined', async () => {
    (disconnectMiddleware as jest.Mock).mockReturnValue({
      before: undefined,
      after: undefined,
      onError: undefined,
    });

    const middleware = sqsMiddleware();

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

    const middleware = sqsMiddleware();

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

    const middleware = sqsMiddleware();

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

    const middleware = sqsMiddleware();

    await expect(middleware.onError(request)).rejects.toThrow(
      'OnError hook error'
    );
  });
});
