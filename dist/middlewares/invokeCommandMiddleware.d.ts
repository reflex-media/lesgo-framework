import middy from '@middy/core';
import { DisconnectMiddlewareOptions } from './disconnectMiddleware';
export interface InvokeCommandMiddlewareOptions extends DisconnectMiddlewareOptions {
    debugMode?: boolean;
    [key: string]: any;
}
declare const invokeCommandMiddleware: (opts?: InvokeCommandMiddlewareOptions) => {
    before: (handler: middy.Request) => Promise<void>;
    after: (handler: middy.Request) => Promise<void>;
    onError: (handler: middy.Request) => Promise<void>;
};
export default invokeCommandMiddleware;
