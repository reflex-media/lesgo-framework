import mysql from 'mysql2/promise';
export interface Singleton {
    [key: string]: mysql.Pool;
}
export interface GetClientOptions {
    dbCredentialsSecretId?: string;
    databaseName?: string;
    region: string;
    singletonConn: string;
}
declare const getClient: (opts: GetClientOptions) => Promise<mysql.Pool>;
export default getClient;
