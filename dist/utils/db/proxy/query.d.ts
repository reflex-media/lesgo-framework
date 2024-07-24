import { PoolOptions } from 'mysql2/promise';
import { RDSAuroraMySQLProxyClientOptions } from '../../../types/aws';
declare const query: (sql: string, poolOpts?: PoolOptions, clientOpts?: RDSAuroraMySQLProxyClientOptions) => Promise<[import("mysql2/promise").QueryResult, import("mysql2/typings/mysql/lib/protocol/packets/FieldPacket").FieldPacket[]]>;
export default query;
