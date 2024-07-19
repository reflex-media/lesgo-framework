import { logger, validateFields } from '../../utils';
import { LesgoException } from '../../exceptions';
import getClient from './getClient';

const FILE = 'lesgo.services.RDSAuroraMySQLService.query';

export interface QueryOptions {
  singletonConn: string;
  region: string;
}

const query = async (sql: string, opts: QueryOptions) => {
  const input = validateFields({ query }, [
    {
      key: 'sql',
      type: 'string',
      required: true,
    },
  ]);

  const connection = await getClient(opts);

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
