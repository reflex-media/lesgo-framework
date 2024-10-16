import { ConnectionOptions } from 'mysql2/promise';
import { RDSAuroraMySQLProxyClientOptions } from '../../../../types/aws';
declare const query: <T>(sql: string, preparedValues?: any[], connOptions?: ConnectionOptions, clientOpts?: RDSAuroraMySQLProxyClientOptions) => Promise<T>;
export default query;
