import { logger, validateFields } from '../../utils';
import { LesgoException } from '../../exceptions';
import getClient from './getClient';

const FILE = 'lesgo.services.RDSAuroraMySQLService.query';

export interface QueryOptions {
  dbCredentialsSecretId?: string;
  databaseName?: string;
  singletonConn: string;
  region: string;
}

export interface GetClientOptions {
  dbCredentialsSecretId?: string;
  databaseName?: string;
  region: string;
  singletonConn: string;
}

const query = async (sql: string, opts: QueryOptions) => {
  const input = validateFields({ query, ...opts }, [
    { key: 'sql', type: 'string', required: true },
    { key: 'dbCredentialsSecretId', type: 'string', required: false },
    { key: 'databaseName', type: 'string', required: false },
    { key: 'singletonConn', type: 'string', required: true },
    { key: 'region', type: 'string', required: true },
  ]) as GetClientOptions & { sql: string };

  const connection = await getClient(input);

  try {
    const [results, fields] = await connection.query(input.sql);

    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { results, fields });
    return { results, fields };
  } catch (err) {
    throw new LesgoException('Failed to query', `${FILE}::QUERY_ERROR`, 500, {
      err,
      query,
      opts,
    });
  }
};

export default query;
