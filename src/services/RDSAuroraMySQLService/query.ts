import { logger, validateFields } from 'src/utils';
import getClient from './getClient';
import { LesgoException } from 'src/exceptions';

const FILE = 'lesgo.services.RDSAuroraMySQLService.query';

export interface QueryOptions {
  singletonConn: string;
  region: string;
}

const query = async (query: string, opts: QueryOptions) => {
  const input = validateFields({ query }, [
    {
      key: 'query',
      type: 'string',
      required: true,
    },
  ]);

  const connection = await getClient(opts);

  try {
    const [results, fields] = await connection.query(input.query);

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
