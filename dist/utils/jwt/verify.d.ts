declare const verify: (token: string, { secret, opts, }?: {
    secret?: string | undefined;
    opts?: {
        keyid?: string | undefined;
        algorithm?: string | Algorithm | undefined;
        validateClaims?: boolean | undefined;
        issuer?: string | undefined;
        audience?: string | undefined;
    } | undefined;
}) => any;
export default verify;
