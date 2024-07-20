import middy from '@middy/core';
export interface invokeCommandMiddlewareOptions {
    debugMode?: boolean;
    [key: string]: any;
}
declare const invokeCommandMiddleware: (opts?: invokeCommandMiddlewareOptions) => {
    before: (handler: middy.Request) => Promise<void>;
    after: (handler: middy.Request) => Promise<void>;
    onError: (handler: middy.Request) => Promise<void>;
};
export default invokeCommandMiddleware;
