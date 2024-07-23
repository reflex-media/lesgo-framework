import getClient from './getClient';
import query from './query';
export { getClient, query };
declare const _default: {
    getClient: (poolOpts?: import("mysql2").PoolOptions | undefined, clientOpts?: import("../../types/aws").RDSAuroraMySQLProxyClientOptions) => Promise<import("mysql2/promise").Pool>;
    query: (sql: string, poolOpts?: import("mysql2").PoolOptions | undefined, clientOpts?: import("../../types/aws").RDSAuroraMySQLProxyClientOptions | undefined) => Promise<[import("mysql2").QueryResult, import("mysql2/typings/mysql/lib/protocol/packets/FieldPacket").FieldPacket[]]>;
};
export default _default;
