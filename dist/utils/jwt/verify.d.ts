declare const verify: (token: string, { secret, opts }?: {
    secret?: string | undefined;
    opts?: any;
}) => any;
export default verify;
