import MemcachePlus from 'memcache-plus';

export default class ElastiCacheService {
  constructor(options) {
    // @TODO:
    // - determine the driver used 'memcached' or 'redis'
    // - add switch-case that will set the driver

    this.setDriver(new MemcachePlus(options));
  }

  setDriver(driver) {
    this.driver = driver;

    return this;
  }
}
