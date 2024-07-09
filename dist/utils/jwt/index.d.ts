import sign from './sign';
import verify from './verify';
export { sign, verify };
declare const _default: {
    sign: (payload: any, { secret, opts }?: {
        secret?: string | undefined;
        opts?: any;
    }) => string;
    verify: (token: string, { secret, opts }?: {
        secret?: string | undefined;
        opts?: any;
    }) => any;
};
export default _default;
