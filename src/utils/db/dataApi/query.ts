import isEmpty from '../../../utils/isEmpty';
import queryService from '../../../services/RDSAuroraMySQLDataAPIService/query';
import validateFields from '../../validateFields';
import config from '../../../config/aws';

export interface QueryOptions {
  secretArn?: string;
  resourceArn?: string;
  databaseName?: string;
  singletonConn?: string;
  region?: string;
}

export interface QueryServiceOptions {
  sql: string;
  secretArn?: string;
  resourceArn?: string;
  databaseName?: string;
  singletonConn: string;
  region: string;
}

const query = async (sql: string, opts: QueryOptions = {}) => {
  opts = {
    ...opts,
    singletonConn: !isEmpty(opts.singletonConn)
      ? opts.singletonConn
      : 'default',
    region: !isEmpty(opts.region)
      ? opts.region
      : config.rds.aurora.mysql.region,
  };

  const input = validateFields({ sql, ...opts }, [
    { key: 'sql', type: 'string', required: true },
    { key: 'singletonConn', type: 'string', required: true },
    { key: 'region', type: 'string', required: true },
    { key: 'secretArn', type: 'string', required: false },
    { key: 'resourceArn', type: 'string', required: false },
    { key: 'databaseName', type: 'string', required: false },
  ]) as QueryServiceOptions;

  return queryService(input.sql, input);
};

export default query;
