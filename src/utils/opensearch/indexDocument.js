import config from 'config/opensearch'; // eslint-disable-line import/no-unresolved
import indexDocument from '../../services/OpenSearchService/indexDocument';

export default (
  documentId,
  data,
  { adapterName = 'default', singletonConn = 'default' } = {}
) => {
  const adapter =
    config.adapters[adapterName === 'default' ? config.default : adapterName];

  return indexDocument(documentId, data, { adapter, singletonConn });
};
