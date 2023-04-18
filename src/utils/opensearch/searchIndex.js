import config from 'config/opensearch'; // eslint-disable-line import/no-unresolved
import searchIndex from '../../services/OpenSearchService/searchIndex';

export default (
  query,
  { adapterName = 'default', singletonConn = 'default' } = {}
) => {
  const adapter =
    config.adapters[adapterName === 'default' ? config.default : adapterName];

  return searchIndex(query, { adapter, singletonConn });
};
