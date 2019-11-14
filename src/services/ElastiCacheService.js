import Memcached from 'memcached-elasticache';

export default class ElastiCacheService {
  constructor({ url, options }) {
    // @TODO:
    // - determine the driver used 'memcached' or 'redis'
    // - add switch-case that will set the driver

    this.setDriver(new Memcached(url, options));
  }

  setDriver(driver) {
    this.driver = driver;

    return this;
  }
}
