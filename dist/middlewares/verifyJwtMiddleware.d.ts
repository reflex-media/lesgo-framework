import middy from '@middy/core';
import { VerifyInputOptions } from '../services/JWTService/verify';
declare const verifyJwtMiddleware: (secret?: string, options?: VerifyInputOptions) => {
    before: (request: middy.Request) => void;
    after: (request: middy.Request) => Promise<void>;
};
export default verifyJwtMiddleware;
