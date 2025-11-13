import middy from '@middy/core';
import { Context } from 'aws-lambda';
import disconnectMiddleware from '../disconnectMiddleware';
import logger from '../../utils/logger';

jest.mock('../../utils/logger');

describe('disconnectMiddleware', () => {
  beforeEach(() => {
    // Setup if needed
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return middleware with after and onError hooks', () => {
    const middleware = disconnectMiddleware();
    expect(middleware).toHaveProperty('after');
    expect(middleware).toHaveProperty('onError');
    expect(middleware.after).toBeInstanceOf(Function);
    expect(middleware.onError).toBeInstanceOf(Function);
  });

  it('should execute disconnect successfully when clients are provided', async () => {
    const mockDisconnect1 = jest.fn().mockResolvedValue(undefined);
    const mockDisconnect2 = jest.fn().mockResolvedValue(undefined);

    const middleware = disconnectMiddleware({
      clients: [mockDisconnect1, mockDisconnect2],
    });

    await middleware.after();

    expect(mockDisconnect1).toHaveBeenCalledTimes(1);
    expect(mockDisconnect2).toHaveBeenCalledTimes(1);
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.middlewares.disconnectMiddleware::PREPARING_TO_DISCONNECT'
    );
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.middlewares.disconnectMiddleware::DISCONNECT_SUCCESS',
      expect.objectContaining({ result: { status: 'fulfilled' } })
    );
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.middlewares.disconnectMiddleware::DISCONNECT_COMPLETED',
      { clients: [mockDisconnect1, mockDisconnect2] }
    );
  });

  it('should execute disconnect on error hook when clients are provided', async () => {
    const mockDisconnect1 = jest.fn().mockResolvedValue(undefined);
    const mockDisconnect2 = jest.fn().mockResolvedValue(undefined);

    const middleware = disconnectMiddleware({
      clients: [mockDisconnect1, mockDisconnect2],
    });

    await middleware.onError();

    expect(mockDisconnect1).toHaveBeenCalledTimes(1);
    expect(mockDisconnect2).toHaveBeenCalledTimes(1);
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.middlewares.disconnectMiddleware::PREPARING_TO_DISCONNECT'
    );
  });

  it('should handle disconnect errors gracefully', async () => {
    const mockDisconnect1 = jest.fn().mockResolvedValue(undefined);
    const mockDisconnect2 = jest
      .fn()
      .mockRejectedValue(new Error('Disconnect failed'));

    const middleware = disconnectMiddleware({
      clients: [mockDisconnect1, mockDisconnect2],
    });

    await middleware.after();

    expect(mockDisconnect1).toHaveBeenCalledTimes(1);
    expect(mockDisconnect2).toHaveBeenCalledTimes(1);
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.middlewares.disconnectMiddleware::DISCONNECT_SUCCESS',
      expect.objectContaining({ result: { status: 'fulfilled' } })
    );
    expect(logger.error).toHaveBeenCalledWith(
      'lesgo.middlewares.disconnectMiddleware::DISCONNECT_ERROR',
      expect.objectContaining({
        result: expect.objectContaining({ status: 'rejected' }),
      })
    );
  });

  it('should not execute disconnect when no clients are provided', async () => {
    const middleware = disconnectMiddleware();

    await middleware.after();

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.middlewares.disconnectMiddleware::PREPARING_TO_DISCONNECT'
    );
    expect(logger.debug).not.toHaveBeenCalledWith(
      'lesgo.middlewares.disconnectMiddleware::DISCONNECT_COMPLETED',
      expect.anything()
    );
  });

  it('should not execute disconnect when empty clients array is provided', async () => {
    const middleware = disconnectMiddleware({ clients: [] });

    await middleware.after();

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.middlewares.disconnectMiddleware::PREPARING_TO_DISCONNECT'
    );
    expect(logger.debug).not.toHaveBeenCalledWith(
      'lesgo.middlewares.disconnectMiddleware::DISCONNECT_COMPLETED',
      expect.anything()
    );
  });

  it('should handle multiple disconnect errors', async () => {
    const mockDisconnect1 = jest.fn().mockRejectedValue(new Error('Error 1'));
    const mockDisconnect2 = jest.fn().mockRejectedValue(new Error('Error 2'));

    const middleware = disconnectMiddleware({
      clients: [mockDisconnect1, mockDisconnect2],
    });

    await middleware.after();

    expect(logger.error).toHaveBeenCalledTimes(2);
    expect(logger.error).toHaveBeenCalledWith(
      'lesgo.middlewares.disconnectMiddleware::DISCONNECT_ERROR',
      expect.objectContaining({
        result: expect.objectContaining({ status: 'rejected' }),
      })
    );
  });
});
