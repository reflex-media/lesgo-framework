import config from 'config/opensearch'; // eslint-disable-line import/no-unresolved
import createIndex from '../../services/OpenSearchService/createIndex';

export default ({
  adapterName = 'default',
  singletonConn = 'default',
} = {}) => {
  const adapter =
    config.adapters[adapterName === 'default' ? config.default : adapterName];

  return createIndex({ adapter, singletonConn });
};
