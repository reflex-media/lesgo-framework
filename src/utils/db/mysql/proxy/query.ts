import { ConnectionOptions } from 'mysql2/promise';
import queryService from '../../../../services/RDSAuroraMySQLProxyService/query';
import { RDSAuroraMySQLProxyClientOptions } from '../../../../types/aws';

const query = async (
  sql: string,
  preparedValues?: any[],
  connOptions?: ConnectionOptions,
  clientOpts?: RDSAuroraMySQLProxyClientOptions
) => {
  const [res] = await queryService(
    sql,
    preparedValues,
    connOptions,
    clientOpts
  );

  return res;
};

export default query;
