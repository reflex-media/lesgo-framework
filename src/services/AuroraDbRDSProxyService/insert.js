import LesgoException from '../../exceptions/LesgoException';
import query from './query';

const FILE = 'services/AuroraDbRDSProxyService/insert';

const insert = async (sql, sqlParams, connectionOpts = {}) => {
  const resp = await query(sql, sqlParams, connectionOpts);

  if (resp.results.affectedRows <= 0) {
    throw new LesgoException(
      'No records inserted from INSERT query',
      `${FILE}::NO_RECORDS_INSERTED`,
      400,
      { resp, sql, sqlParams }
    );
  }

  return resp.results.insertId;
};

export default insert;
