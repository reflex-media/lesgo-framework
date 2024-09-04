import { VerifyOptions } from 'jsonwebtoken';
export interface VerifyInputOptions extends VerifyOptions {
    validateClaims?: boolean;
    keyid?: string;
}
declare const verify: (token: string, secret?: string, opts?: VerifyInputOptions) => string | import("jsonwebtoken").JwtPayload | import("jsonwebtoken").Jwt;
export default verify;
