import queryService from '../../../../services/RDSAuroraMySQLProxyService/query';
const query = (sql, preparedValues, connOptions, clientOpts) => {
  return queryService(sql, preparedValues, connOptions, clientOpts);
};
export default query;
