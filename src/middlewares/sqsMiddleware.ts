import middy from '@middy/core';
import eventNormalizer from '@middy/event-normalizer';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import disconnectMiddleware from './disconnectMiddleware';

interface MiddlewareObj<T = any, R = any> {
  before?: (request: middy.Request<T, R>) => Promise<void>;
  after?: (request: middy.Request<T, R>) => Promise<void>;
  onError?: (request: middy.Request<T, R>) => Promise<void>;
}

export interface HttpMiddlewareOptions {
  debugMode?: boolean;
}

const httpMiddleware = () => {
  const middlewarePackages: MiddlewareObj[] = [
    doNotWaitForEmptyEventLoop(),
    eventNormalizer(),
    disconnectMiddleware(),
  ];

  return {
    before: async (handler: middy.Request) => {
      for (const middleware of middlewarePackages) {
        if (middleware.before) {
          await middleware.before(handler);
        }
      }
    },
    after: async (handler: middy.Request) => {
      for (const middleware of middlewarePackages) {
        if (middleware.after) {
          await middleware.after(handler);
        }
      }
    },
    onError: async (handler: middy.Request) => {
      for (const middleware of middlewarePackages) {
        if (middleware.onError) {
          await middleware.onError(handler);
        }
      }
    },
  };
};

export default httpMiddleware;
