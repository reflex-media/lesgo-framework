import sign from './sign';
import verify from './verify';
export { sign, verify };
declare const _default: {
    sign: (payload: any, secret?: string | undefined, opts?: import("jsonwebtoken").SignOptions | undefined) => string;
    verify: (token: string, secret?: string | undefined, opts?: import("../../services/JWTService/verify").VerifyInputOptions | undefined) => string | import("jsonwebtoken").JwtPayload | import("jsonwebtoken").Jwt;
};
export default _default;
