import getClient from './getClient';
import query from './query';
export { getClient, query };
declare const _default: {
    getClient: (connOptions?: import("mysql2").ConnectionOptions | undefined, clientOpts?: import("../../../../types/aws").RDSAuroraMySQLProxyClientOptions | undefined) => Promise<import("mysql2/promise").Connection>;
    query: (sql: string, preparedValues?: any[] | undefined, connOptions?: import("mysql2").ConnectionOptions | undefined, clientOpts?: import("../../../../types/aws").RDSAuroraMySQLProxyClientOptions | undefined) => Promise<[import("mysql2").QueryResult, import("mysql2/typings/mysql/lib/protocol/packets/FieldPacket").FieldPacket[]]>;
};
export default _default;
