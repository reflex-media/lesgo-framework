import config from 'Config/cache'; // eslint-disable-line import/no-unresolved
import ElastiCacheService from '../services/ElastiCacheService';
import LesgoException from '../exceptions/LesgoException';

/**
 * Reusable instance
 */
const singleton = [];

/**
 * Instantiate the Cache Service
 *
 * @param {object} conn The connection options
 * @return {object} Returns the driver
 */
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

/**
 * Fetch data from cache by key
 *
 * @param {string} key Cache key to fetch data.
 * @return {promise} Returns promised.
 */
const get = key => {
  return new Promise((res, rej) => {
    try {
      ec().get(key, (err, data) => {
        if (err) {
          rej(new LesgoException(err, 'CACHE_GET_ERROR'));
        } else {
          res(data);
        }
      });
    } catch (err) {
      rej(new LesgoException(err.message, 'CACHE_GET_EXCEPTION', 500, err));
    }

    ec().end();
  });
};

/**
 * Save data to cache
 *
 * @param {string} key Cache key to save data.
 * @param {string|object} val Value of data to cache.
 * @param {integer} lifetime Time in seconds to expire cache.
 * @return {promise} Returns promised.
 */
const set = (key, val, lifetime) => {
  return new Promise((res, rej) => {
    try {
      ec().set(key, val, lifetime, err => {
        if (err) {
          rej(new LesgoException(err, 'CACHE_SET_ERROR'));
        } else {
          res(true);
        }
      });
    } catch (err) {
      rej(new LesgoException(err.message, 'CACHE_SET_EXCEPTION', 500, err));
    }

    ec().end();
  });
};

/**
 * Remove the key from cache
 *
 * @param {string} key Cache key to delete.
 * @return {promise} Returns promised.
 */
const del = key => {
  return new Promise((res, rej) => {
    try {
      ec().del(key, err => {
        if (err) {
          rej(new LesgoException(err, 'CACHE_DEL_ERROR'));
        } else {
          res(true);
        }
      });
    } catch (err) {
      rej(new LesgoException(err.message, 'CACHE_DEL_EXCEPTION', 500, err));
    }

    ec().end();
  });
};

export default {
  ec,
  get,
  set,
  del,
};
