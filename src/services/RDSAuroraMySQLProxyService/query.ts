import { PoolOptions } from 'mysql2/promise';
import { logger, validateFields } from '../../utils';
import { RDSAuroraMySQLProxyClientOptions } from '../../types/aws';
import { LesgoException } from '../../exceptions';
import getClient from './getClient';

const FILE = 'lesgo.services.RDSAuroraMySQLService.query';

const query = async (
  sql: string,
  poolOpts?: PoolOptions,
  clientOpts?: RDSAuroraMySQLProxyClientOptions
) => {
  const input = validateFields({ sql }, [
    { key: 'sql', type: 'string', required: true },
  ]);

  const connection = await getClient(poolOpts, clientOpts);

  try {
    const resp = await connection.query(input.sql);
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, resp);

    return resp;
  } catch (err) {
    throw new LesgoException('Failed to query', `${FILE}::QUERY_ERROR`, 500, {
      err,
      poolOpts,
      clientOpts,
      sql,
    });
  }
};

export default query;
