import { logger, validateFields } from '../../utils';
import { LesgoException } from '../../exceptions';
import getClient from './getClient';

const FILE = 'lesgo.services.RDSAuroraMySQLService.query';

export interface QueryOptions {
  secretArn?: string;
  resourceArn?: string;
  databaseName?: string;
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

  const { client, params } = await getClient(opts);

  const sqlParams = {
    ...params,
    sql: input.sql,
  };

  try {
    const result = await client.executeStatement(sqlParams).promise();
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, result);

    return result;
  } catch (err) {
    throw new LesgoException('Failed to query', `${FILE}::QUERY_ERROR`, 500, {
      err,
      sql,
      opts,
    });
  }
};

export default query;
