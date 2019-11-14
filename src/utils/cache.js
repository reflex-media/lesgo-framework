import config from 'Config/cache'; // eslint-disable-line import/no-unresolved
import ElastiCacheService from '../services/ElastiCacheService';

const singleton = [];

const ec = (conn = null) => {
  if (singleton[conn]) {
    return singleton[conn];
  }

  const { driver } = new ElastiCacheService({
    ...config.connections[conn || config.default],
  });

  singleton[conn] = driver;

  return driver;
};

export default ec;
