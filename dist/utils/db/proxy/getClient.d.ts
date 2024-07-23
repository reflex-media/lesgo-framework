import { PoolOptions } from 'mysql2/promise';
import { RDSAuroraMySQLProxyClientOptions } from '../../../types/aws';
declare const getClient: (poolOpts?: PoolOptions, clientOpts?: RDSAuroraMySQLProxyClientOptions) => Promise<import("mysql2/promise").Pool>;
export default getClient;
