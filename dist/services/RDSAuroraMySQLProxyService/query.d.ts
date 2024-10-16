import { ConnectionOptions, FieldPacket, QueryResult } from 'mysql2/promise';
import { RDSAuroraMySQLProxyClientOptions } from '../../types/aws';
type QueryReturn<T> = [T, FieldPacket[]];
declare const query: <T = QueryResult>(sql: string, preparedValues?: any[], connOptions?: ConnectionOptions, clientOpts?: RDSAuroraMySQLProxyClientOptions) => Promise<QueryReturn<T>>;
export default query;
