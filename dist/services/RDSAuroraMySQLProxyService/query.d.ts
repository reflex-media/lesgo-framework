export interface QueryOptions {
    dbCredentialsSecretId?: string;
    databaseName?: string;
    singletonConn: string;
    region: string;
}
export interface GetClientOptions {
    dbCredentialsSecretId?: string;
    databaseName?: string;
    region: string;
    singletonConn: string;
}
declare const query: (sql: string, opts: QueryOptions) => Promise<{
    results: import("mysql2").QueryResult;
    fields: import("mysql2/typings/mysql/lib/protocol/packets/FieldPacket").FieldPacket[];
}>;
export default query;
