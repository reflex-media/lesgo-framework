import getClient from './getClient';
import query from './query';
export { getClient, query };
declare const _default: {
    getClient: (opts: import("./getClient").GetClientOptions) => Promise<import("mysql2/promise").Pool>;
    query: (sql: string, opts: import("./query").QueryOptions) => Promise<{
        results: import("mysql2").QueryResult;
        fields: import("mysql2/typings/mysql/lib/protocol/packets/FieldPacket").FieldPacket[];
    }>;
};
export default _default;
