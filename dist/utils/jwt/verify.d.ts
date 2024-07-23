import { VerifyInputOptions } from '../../services/JWTService/verify';
declare const verify: (token: string, secret?: string, opts?: VerifyInputOptions) => string | import("jsonwebtoken").JwtPayload | import("jsonwebtoken").Jwt;
export default verify;
