export interface QueryOptions {
    singletonConn: string;
    region: string;
}
declare const query: (sql: string, opts: QueryOptions) => Promise<{
    results: import("mysql2").QueryResult;
    fields: import("mysql2/typings/mysql/lib/protocol/packets/FieldPacket").FieldPacket[];
}>;
export default query;
