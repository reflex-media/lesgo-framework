import { ConnectionOptions, FieldPacket, QueryResult } from 'mysql2/promise';
import { logger, validateFields } from '../../utils';
import { RDSAuroraMySQLProxyClientOptions } from '../../types/aws';
import { LesgoException } from '../../exceptions';
import getClient from './getMySQLProxyClient';

const FILE = 'lesgo.services.RDSAuroraMySQLService.query';

type QueryResultType<T> = T extends QueryResult ? T : never;

type QueryReturn<T> = [T, FieldPacket[]];

const query = async <T = QueryResult>(
  sql: string,
  preparedValues?: any[],
  connOptions?: ConnectionOptions,
  clientOpts?: RDSAuroraMySQLProxyClientOptions
): Promise<QueryReturn<T>> => {
  const input = validateFields({ sql, preparedValues }, [
    { key: 'sql', type: 'string', required: true },
    { key: 'preparedValues', type: 'array', required: false },
  ]);

  const connection = await getClient(connOptions, clientOpts);

  try {
    const resp = await connection.execute<QueryResultType<T>>(
      input.sql,
      input.preparedValues
    );
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, {
      result: resp[0],
      sql,
      preparedValues,
    });

    return resp;
  } catch (err) {
    throw new LesgoException('Failed to query', `${FILE}::QUERY_ERROR`, 500, {
      err,
      sql,
      preparedValues,
      connOptions,
      clientOpts,
    });
  }
};

export default query;
