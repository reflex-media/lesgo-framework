import logger from '../../utils/logger';
import query from './query';

const FILE = 'services/AuroraDbRDSProxyService/update';

const update = async (sql, sqlParams, connectionOpts = {}) => {
  const resp = await query(sql, sqlParams, connectionOpts);

  if (resp.results.changedRows <= 0) {
    logger.warn(`${FILE}::No records updated from UPDATE query`, {
      sql,
      sqlParams,
    });
  }

  return Promise.resolve();
};

export default update;
