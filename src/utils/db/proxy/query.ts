import { ConnectionOptions } from 'mysql2/promise';
import queryService from '../../../services/RDSAuroraMySQLProxyService/query';
import { RDSAuroraMySQLProxyClientOptions } from '../../../types/aws';

const query = (
  sql: string,
  preparedValues?: any[],
  connOptions?: ConnectionOptions,
  clientOpts?: RDSAuroraMySQLProxyClientOptions
) => {
  return queryService(sql, preparedValues, connOptions, clientOpts);
};

export default query;
