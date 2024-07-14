import middy from '@middy/core';
export interface HttpMiddlewareOptions {
    debugMode?: boolean;
    headers?: Record<string, string>;
    isBase64Encoded?: boolean;
}
declare const httpMiddleware: (opts?: HttpMiddlewareOptions) => {
    before: (handler: middy.Request) => Promise<void>;
    after: (handler: middy.Request) => Promise<void>;
    onError: (handler: middy.Request) => Promise<void>;
};
export default httpMiddleware;
