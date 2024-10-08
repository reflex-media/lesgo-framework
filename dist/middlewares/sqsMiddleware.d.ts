import middy from '@middy/core';
export interface HttpMiddlewareOptions {
    debugMode?: boolean;
}
declare const httpMiddleware: () => {
    before: (handler: middy.Request) => Promise<void>;
    after: (handler: middy.Request) => Promise<void>;
    onError: (handler: middy.Request) => Promise<void>;
};
export default httpMiddleware;
