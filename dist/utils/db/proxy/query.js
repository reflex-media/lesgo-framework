import queryService from '../../../services/RDSAuroraMySQLProxyService/query';
const query = (sql, poolOpts, clientOpts) => {
  return queryService(sql, poolOpts, clientOpts);
};
export default query;
