import middy from '@middy/core';
import { HttpMiddlewareOptions } from './httpMiddleware';
declare const httpResponseMiddleware: (opts?: HttpMiddlewareOptions) => {
    after: (request: middy.Request) => Promise<void>;
    onError: (request: middy.Request) => Promise<void>;
};
export default httpResponseMiddleware;
