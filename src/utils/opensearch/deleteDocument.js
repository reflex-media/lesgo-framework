import config from 'config/opensearch'; // eslint-disable-line import/no-unresolved
import deleteDocument from '../../services/OpenSearchService/deleteDocument';

export default (
  query,
  { adapterName = 'default', singletonConn = 'default' } = {}
) => {
  const adapter =
    config.adapters[adapterName === 'default' ? config.default : adapterName];

  return deleteDocument(query, { adapter, singletonConn });
};
