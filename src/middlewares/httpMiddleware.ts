import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import eventNormalizer from '@middy/http-event-normalizer';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpResponseMiddleware from './httpResponseMiddleware';

interface MiddlewareObj<T = any, R = any> {
  before?: (request: middy.Request<T, R>) => Promise<void>;
  after?: (request: middy.Request<T, R>) => Promise<void>;
  onError?: (request: middy.Request<T, R>) => Promise<void>;
}

export interface HttpMiddlewareOptions {
  debugMode?: boolean;
  headers?: Record<string, string>;
  isBase64Encoded?: boolean;
}

const httpMiddleware = (opts: HttpMiddlewareOptions = {}) => {
  const middlewarePackages: MiddlewareObj[] = [
    doNotWaitForEmptyEventLoop(),
    eventNormalizer(),
    httpHeaderNormalizer(),
    jsonBodyParser({ disableContentTypeError: true }),
    httpResponseMiddleware(opts),
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
