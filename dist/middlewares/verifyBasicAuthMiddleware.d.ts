import middy from '@middy/core';
export interface VerifyJwtOptions {
    keyid?: string;
    algorithm?: string;
    validateClaims?: boolean;
    issuer?: string;
    audience?: string;
    secret?: string;
}
declare const verifyBasicAuthMiddleware: (options?: VerifyJwtOptions) => {
    before: (request: middy.Request) => void;
};
export default verifyBasicAuthMiddleware;
