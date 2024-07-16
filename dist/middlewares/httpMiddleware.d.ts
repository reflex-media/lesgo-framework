import middy from '@middy/core';
import { VerifyJwtOptions } from './verifyJwtMiddleware';
export interface HttpMiddlewareOptions extends VerifyJwtOptions {
    debugMode?: boolean;
    headers?: Record<string, string>;
    isBase64Encoded?: boolean;
    isVerifyJwt?: boolean;
}
declare const httpMiddleware: (opts?: HttpMiddlewareOptions) => {
    before: (handler: middy.Request) => Promise<void>;
    after: (handler: middy.Request) => Promise<void>;
    onError: (handler: middy.Request) => Promise<void>;
};
export default httpMiddleware;
