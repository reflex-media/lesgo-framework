import middy from '@middy/core';
export interface VerifyBasicAuthMiddlewareOptions {
    debugMode?: boolean;
}
declare const verifyBasicAuthMiddleware: (options?: VerifyBasicAuthMiddlewareOptions) => {
    before: (request: middy.Request) => void;
    after: (request: middy.Request) => Promise<void>;
};
export default verifyBasicAuthMiddleware;
