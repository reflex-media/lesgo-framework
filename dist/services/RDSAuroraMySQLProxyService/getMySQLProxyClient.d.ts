import mysql, { ConnectionOptions } from 'mysql2/promise';
import { RDSAuroraMySQLProxyClientOptions } from '../../types/aws';
export interface Singleton {
    [key: string]: mysql.Connection;
}
export declare const singleton: Singleton;
declare const getMySQLProxyClient: (connOptions?: ConnectionOptions, clientOpts?: RDSAuroraMySQLProxyClientOptions) => Promise<mysql.Connection>;
export default getMySQLProxyClient;
