declare const sign: (payload: any, { secret, opts }?: {
    secret?: string | undefined;
    opts?: any;
}) => string;
export default sign;
