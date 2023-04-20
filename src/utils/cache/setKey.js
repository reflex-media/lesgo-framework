import config from 'config/cache'; // eslint-disable-line import/no-unresolved
import setKey from '../../services/MemcacheElastiCacheService/setKey';

export default (
  key,
  value,
  { adapterName = 'default', singletonConn = 'default', ttl = undefined } = {}
) => {
  const adapter =
    config.adapters[adapterName === 'default' ? config.default : adapterName];

  return setKey(key, value, ttl, { adapter, singletonConn });
};
