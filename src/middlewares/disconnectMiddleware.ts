import logger from '../utils/logger';

const FILE = 'lesgo.middlewares.disconnectMiddleware';

export interface DisconnectMiddlewareOptions {
  clients?: any[];
}

const disconnectMiddleware = (opts?: DisconnectMiddlewareOptions) => {
  const disconnect = async () => {
    logger.debug(`${FILE}::PREPARING_TO_DISCONNECT`);

    const disconnect: any[] = [];

    if (opts?.clients && opts?.clients?.length > 0) {
      opts.clients.forEach(client => {
        disconnect.push(client());
      });
    }

    if (disconnect.length > 0) {
      const results = await Promise.allSettled(disconnect);

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          logger.debug(`${FILE}::DISCONNECT_SUCCESS`, { result });
        } else if (result.status === 'rejected') {
          logger.error(`${FILE}::DISCONNECT_ERROR`, { result });
        }
      });

      logger.debug(`${FILE}::DISCONNECT_COMPLETED`, opts);
    }
  };

  const disconnectMiddlewareAfter = async () => {
    await disconnect();
  };

  const disconnectMiddlewareOnError = async () => {
    await disconnect();
  };

  return {
    after: disconnectMiddlewareAfter,
    onError: disconnectMiddlewareOnError,
  };
};

export default disconnectMiddleware;
