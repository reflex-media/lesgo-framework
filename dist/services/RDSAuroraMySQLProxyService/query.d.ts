import { ConnectionOptions } from 'mysql2/promise';
import { RDSAuroraMySQLProxyClientOptions } from '../../types/aws';
declare const query: (sql: string, preparedValues?: any[], connOptions?: ConnectionOptions, clientOpts?: RDSAuroraMySQLProxyClientOptions) => Promise<[import("mysql2/promise").QueryResult, import("mysql2/typings/mysql/lib/protocol/packets/FieldPacket").FieldPacket[]]>;
export default query;
