import middy from '@middy/core';
declare const httpResponseMiddleware: (opts?: {}) => {
    after: (request: middy.Request) => Promise<void>;
    onError: (request: middy.Request) => Promise<void>;
};
export default httpResponseMiddleware;
