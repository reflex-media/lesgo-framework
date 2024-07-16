import middy from '@middy/core';
export interface VerifyJwtOptions {
    keyid?: string;
    algorithm?: string;
    validateClaims?: boolean;
    issuer?: string;
    audience?: string;
    secret?: string;
}
declare const verifyJwtMiddleware: (options?: VerifyJwtOptions) => {
    before: (request: middy.Request) => Promise<void>;
};
export default verifyJwtMiddleware;
