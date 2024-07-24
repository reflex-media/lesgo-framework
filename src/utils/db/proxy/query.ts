import { PoolOptions } from 'mysql2/promise';
import queryService from '../../../services/RDSAuroraMySQLProxyService/query';
import { RDSAuroraMySQLProxyClientOptions } from '../../../types/aws';

const query = (
  sql: string,
  poolOpts?: PoolOptions,
  clientOpts?: RDSAuroraMySQLProxyClientOptions
) => {
  return queryService(sql, poolOpts, clientOpts);
};

export default query;
