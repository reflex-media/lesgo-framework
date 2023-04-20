import config from 'config/cache'; // eslint-disable-line import/no-unresolved
import getKey from '../../services/MemcacheElastiCacheService/getKey';

export default (
  key,
  { adapterName = 'default', singletonConn = 'default' } = {}
) => {
  const adapter =
    config.adapters[adapterName === 'default' ? config.default : adapterName];

  return getKey(key, { adapter, singletonConn });
};
