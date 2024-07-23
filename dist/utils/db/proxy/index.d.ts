import getClient from './getClient';
export { getClient };
declare const _default: {
    getClient: (poolOpts?: import("mysql2").PoolOptions | undefined, clientOpts?: import("../../../types/aws").RDSAuroraMySQLProxyClientOptions | undefined) => Promise<import("mysql2/promise").Pool>;
};
export default _default;
