import query from './query';

const select = async (sql, sqlParams, connectionOpts = {}) => {
  const resp = await query(sql, sqlParams, connectionOpts);

  return resp.results;
};

export default select;
