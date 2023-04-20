import config from 'config/cache'; // eslint-disable-line import/no-unresolved
import deleteKey from '../../services/MemcacheElastiCacheService/deleteKey';

export default (
  key,
  { adapterName = 'default', singletonConn = 'default' } = {}
) => {
  const adapter =
    config.adapters[adapterName === 'default' ? config.default : adapterName];

  return deleteKey(key, { adapter, singletonConn });
};
