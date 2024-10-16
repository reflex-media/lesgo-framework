import { ConnectionOptions } from 'mysql2/promise';
import queryService from '../../../../services/RDSAuroraMySQLProxyService/query';
import { RDSAuroraMySQLProxyClientOptions } from '../../../../types/aws';

const query = async <T>(
  sql: string,
  preparedValues?: any[],
  connOptions?: ConnectionOptions,
  clientOpts?: RDSAuroraMySQLProxyClientOptions
) => {
  const [res] = await queryService<T>(
    sql,
    preparedValues,
    connOptions,
    clientOpts
  );

  return res;
};

export default query;
