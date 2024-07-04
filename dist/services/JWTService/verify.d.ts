import { VerifyOptions } from 'jsonwebtoken';
declare const verify: (token: string, secret: string, opts?: VerifyOptions) => string | import("jsonwebtoken").Jwt | import("jsonwebtoken").JwtPayload;
export default verify;
