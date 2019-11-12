import Memcached from 'memcached-elasticache';

export default class ElastiCacheService {
  constructor({ url, options }) {
    this.setDriver(new Memcached(url, options));
  }

  setDriver(driver) {
    this.driver = driver;

    return this;
  }
}
