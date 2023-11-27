import LesgoException from '../../exceptions/LesgoException';
import isEmpty from '../../utils/isEmpty';
import logger from '../../utils/logger';
import connect, { end } from './connect';

const FILE = 'services/AuroraDbRDSProxyService/query';

const query = async (sql, sqlParams, connectionOpts = {}) => {
  const conn = await connect(connectionOpts);

  try {
    logger.debug(`${FILE}::QUERYING_DB`, { sql, sqlParams });
    const [results, fields] = await conn.execute(sql, sqlParams);
    logger.debug(`${FILE}::DB_RESPONSE`, { results, fields });

    return { results, fields };
  } catch (err) {
    throw new LesgoException(
      'Exception caught executing SQL Statement',
      `${FILE}::QUERY_EXECUTION_EXCEPTION`,
      500,
      { err }
    );
  } finally {
    if (isEmpty(conn) || !isEmpty(connectionOpts)) {
      await end(conn);
    }
  }
};

export default query;
