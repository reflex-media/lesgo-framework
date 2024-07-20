import { ExecuteStatementCommand } from '@aws-sdk/client-rds-data';
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
  const input = validateFields({ sql, ...opts }, [
    { key: 'sql', type: 'string', required: true },
    { key: 'secretArn', type: 'string', required: false },
    { key: 'resourceArn', type: 'string', required: false },
    { key: 'databaseName', type: 'string', required: false },
    { key: 'singletonConn', type: 'string', required: true },
    { key: 'region', type: 'string', required: true },
  ]);

  const { client, params } = await getClient(opts);

  const sqlParams = {
    ...params,
    secretArn: (input.secretArn ?? params.secretArn) as string,
    resourceArn: (input.resourceArn ?? params.resourceArn) as string,
    database: (input.databaseName ?? params.database) as string,
    sql: input.sql as string,
  };

  const command = new ExecuteStatementCommand(sqlParams);

  try {
    const result = await client.send(command);
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { result, sqlParams });

    return result;
  } catch (err) {
    throw new LesgoException('Failed to query', `${FILE}::QUERY_ERROR`, 500, {
      err,
      sql,
      opts,
      sqlParams,
    });
  }
};

export default query;
