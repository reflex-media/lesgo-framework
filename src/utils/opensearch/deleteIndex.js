import config from 'config/opensearch'; // eslint-disable-line import/no-unresolved
import deleteIndex from '../../services/OpenSearchService/deleteIndex';

export default ({
  adapterName = 'default',
  singletonConn = 'default',
} = {}) => {
  const adapter =
    config.adapters[adapterName === 'default' ? config.default : adapterName];

  return deleteIndex({ adapter, singletonConn });
};
