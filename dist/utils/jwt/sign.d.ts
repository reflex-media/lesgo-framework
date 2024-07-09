import { Algorithm } from 'jsonwebtoken';
declare const sign: (payload: any, { secret, opts, }?: {
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
export default sign;
