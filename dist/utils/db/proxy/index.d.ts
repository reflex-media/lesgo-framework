import getClient from './getClient';
export { getClient };
declare const _default: {
    getClient: ({ singletonConn, region }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
    }) => Promise<import("mysql2/promise").Pool>;
};
export default _default;
