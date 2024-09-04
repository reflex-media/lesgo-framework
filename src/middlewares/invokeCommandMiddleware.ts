import middy from '@middy/core';
import eventNormalizer from '@middy/event-normalizer';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import disconnectMiddleware, {
  DisconnectMiddlewareOptions,
} from './disconnectMiddleware';

interface MiddlewareObj<T = any, R = any> {
  before?: (request: middy.Request<T, R>) => Promise<void>;
  after?: (request: middy.Request<T, R>) => Promise<void>;
  onError?: (request: middy.Request<T, R>) => Promise<void>;
}

export interface InvokeCommandMiddlewareOptions
  extends DisconnectMiddlewareOptions {
  debugMode?: boolean;
  [key: string]: any;
}

const invokeCommandMiddleware = (opts: InvokeCommandMiddlewareOptions = {}) => {
  const middlewarePackages: MiddlewareObj[] = [
    doNotWaitForEmptyEventLoop(),
    eventNormalizer(),
    disconnectMiddleware(opts),
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

export default invokeCommandMiddleware;
