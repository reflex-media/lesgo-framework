import { Pool, ConnectionOptions } from 'mysql2/promise';
import { RDSAuroraMySQLProxyClientOptions } from '../../types/aws';
export interface Singleton {
    [key: string]: Pool;
}
export declare const singleton: Singleton;
declare const getClient: (connOptions?: ConnectionOptions, clientOpts?: RDSAuroraMySQLProxyClientOptions) => Promise<Pool>;
export default getClient;
