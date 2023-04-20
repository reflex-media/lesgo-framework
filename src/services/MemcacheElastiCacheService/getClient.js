import MemcachePlus from 'memcache-plus';
import logger from '../../utils/logger';
import isEmpty from '../../utils/isEmpty';

const FILE = 'services/MemcacheElastiCacheService/getClient';

const singleton = {};

const getClient = opts => {
  const { singletonConn, adapter } = opts;

  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, { opts });
    return singleton[singletonConn];
  }

  const client = new MemcachePlus(adapter.options);
  singleton[singletonConn] = client;
  logger.debug(`${FILE}::NEW_CLIENT_SINGLETON`, { opts });

  return client;
};

export const getClientSingleton = () => {
  return singleton;
};

export const deleteClientSingleton = () => {
  Object.keys(singleton).forEach(singletonConn => {
    delete singleton[singletonConn];
  });
};

export default getClient;
