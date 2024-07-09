import sign from './sign';
import verify from './verify';
export { sign, verify };
declare const _default: {
    sign: (payload: any, secret: string, opts?: import("jsonwebtoken").SignOptions) => string;
    verify: (token: string, secret: string, opts?: import("jsonwebtoken").VerifyOptions) => string | import("jsonwebtoken").Jwt | import("jsonwebtoken").JwtPayload;
};
export default _default;
