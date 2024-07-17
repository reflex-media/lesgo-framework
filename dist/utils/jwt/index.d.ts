import sign from './sign';
import verify from './verify';
export { sign, verify };
declare const _default: {
    sign: (payload: any, { secret, opts, }?: {
        secret?: string | undefined;
        opts?: {
            keyid?: string | undefined;
            algorithm?: string | undefined;
            expiresIn?: string | undefined;
            issuer?: string | undefined;
            audience?: string | undefined;
            subject?: string | undefined;
        } | undefined;
    }) => string;
    verify: (token: string, { secret, opts, }?: {
        secret?: string | undefined;
        opts?: {
            keyid?: string | undefined;
            algorithm?: string | Algorithm | undefined;
            validateClaims?: boolean | undefined;
            issuer?: string | undefined;
            audience?: string | undefined;
        } | undefined;
    }) => string | import("jsonwebtoken").Jwt | import("jsonwebtoken").JwtPayload;
};
export default _default;
