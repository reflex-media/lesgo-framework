import select from './select';

const selectFirst = async (sql, sqlParams, connectionOpts = {}) => {
  const results = await select(sql, sqlParams, connectionOpts);

  return results[0];
};

export default selectFirst;
