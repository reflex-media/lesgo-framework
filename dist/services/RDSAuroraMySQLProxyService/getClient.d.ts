import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import { RDSAuroraMySQLProxyClientOptions } from '../../types/aws';
export interface Singleton {
    [key: string]: Pool;
}
declare const getClient: (poolOpts?: PoolOptions, clientOpts?: RDSAuroraMySQLProxyClientOptions) => Promise<mysql.Pool>;
export default getClient;
