import config from 'Config/cache'; // eslint-disable-line import/no-unresolved
import ElastiCacheService from '../services/ElastiCacheService';
import LesgoException from '../exceptions/LesgoException';
import logger from './logger';

const FILE = 'Lesgo/utils/cache';

/**
 * Reusable instance
 */
const singleton = {};

/**
 * Instantiate the Cache Service
 *
 * @param {String} connectionName The name of the driver config to connect to
 * @return {object} Returns the driver
 */
const ec = (connectionName = '') => {
  const conn = connectionName || config.default;
  if (singleton[conn]) {
    return singleton[conn];
  }

  let { options } = config.connections[conn];

  if (config.connections[conn].url) {
    // this is a legacy config with memcached-elasticache package
    // remap to new config
    options = {
      ...options,
      hosts: [config.connections[conn].url],
    };
  }

  const { driver } = new ElastiCacheService(options);

  singleton[conn] = driver;

  return driver;
};

/**
 * Fetch data from cache by key
 *
 * @param {string} key Cache key to fetch data.
 * @return {promise} Returns promised.
 */
const get = async key => {
  try {
    const data = await ec().get(key);
    logger.debug(`${FILE}::Fetched cache data`, { key, data });
    return data;
  } catch (err) {
    throw new LesgoException(err.message, 'CACHE_GET_EXCEPTION', 500, err);
  }
};

/**
 * Fetch data from cache by multiple keys
 *
 * @param {array} keys Array of Cache keys to fetch data.
 * @return {promise} Returns promised.
 */
const getMulti = async keys => {
  try {
    const data = await ec().getMulti(keys);
    logger.debug(`${FILE}::Fetched cache data`, { keys, data });
    return data;
  } catch (err) {
    throw new LesgoException(
      err.message,
      'CACHE_GET_MULTI_EXCEPTION',
      500,
      err
    );
  }
};

/**
 * Save data to cache
 *
 * @param {string} key Cache key to save data.
 * @param {string|object} val Value of data to cache.
 * @param {integer} lifetime Time in seconds to expire cache.
 * @return {promise} Returns promised.
 */
const set = async (key, val, lifetime) => {
  try {
    await ec().set(key, val, lifetime);
    logger.debug(`${FILE}::Cache stored`, { key, val, lifetime });
  } catch (err) {
    throw new LesgoException(err.message, 'CACHE_SET_EXCEPTION', 500, err);
  }
};

/**
 * Remove the key from cache
 *
 * @param {string} key Cache key to delete.
 * @return {promise} Returns promised.
 */
const del = async key => {
  try {
    await ec().delete(key);
    logger.debug(`${FILE}::Key deleted from cache`, { key });
  } catch (err) {
    throw new LesgoException(err.message, 'CACHE_DEL_EXCEPTION', 500, err);
  }
};

/**
 * Remove data from cache by multiple keys
 *
 * @param {array} keys Array of Cache keys to delete data.
 * @return {promise} Returns promised.
 */
const delMulti = async keys => {
  try {
    await ec().deleteMulti(keys);
    logger.debug(`${FILE}::Keys deleted from cache`, { keys });
  } catch (err) {
    throw new LesgoException(
      err.message,
      'CACHE_DEL_MULTI_EXCEPTION',
      500,
      err
    );
  }
};

/**
 * Ends the connection
 *
 * @return {promise} Returns promised.
 */
const end = async () => {
  try {
    await ec().disconnect();

    // TODO: Should loop through all the possible connection objects
    delete singleton.memcached;
  } catch (err) {
    throw new LesgoException(err.message, 'CACHE_END_EXCEPTION', 500, err);
  }
};

/**
 * Alias of end()
 *
 * @return {promise} Returns promised.
 */
const disconnect = () => {
  return end();
};

export default {
  ec,
  get,
  getMulti,
  set,
  del,
  delMulti,
  end,
  disconnect,
  singleton,
};
