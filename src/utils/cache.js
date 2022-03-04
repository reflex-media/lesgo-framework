import config from 'Config/cache'; // eslint-disable-line import/no-unresolved
import ElastiCacheService from '../services/ElastiCacheService';
import LesgoException from '../exceptions/LesgoException';
import logger from './logger';
import isEmpty from './isEmpty';

const FILE = 'Lesgo/utils/cache';

/**
 * Reusable instance
 */
const singleton = {};

/**
 * Instantiate the Cache Service
 *
 * @param {String} connectionName The name of the driver config to connect to
 * @param {boolean} persists To use persistent connection or otherwise
 *
 * @return {object} Returns the driver
 */
const ec = (connectionName = '', persists = false) => {
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

  if (persists) {
    singleton[conn] = driver;
  }

  return driver;
};

/**
 * Persistent connection if declared in the handler
 */
const pConnect = (connectionName = '') => {
  return ec(connectionName, true);
};

/**
 * Fetch data from cache by key
 *
 * @param {string} key Cache key to fetch data.
 * @return {promise} Returns promised.
 */
const get = async key => {
  try {
    const client = ec();
    const data = await client.get(key);
    logger.debug(`${FILE}::Fetched cache data`, { key, data });
    if (isEmpty(singleton)) {
      logger.debug(`${FILE}::Ending cache connection`);
      await client.disconnect();
      logger.debug(`${FILE}::Ended cache connection`);
    }
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
    const client = ec();
    const data = await client.getMulti(keys);
    logger.debug(`${FILE}::Fetched cache data`, { keys, data });
    if (isEmpty(singleton)) {
      logger.debug(`${FILE}::Ending cache connection`);
      await client.disconnect();
      logger.debug(`${FILE}::Ended cache connection`);
    }
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
    const client = ec();
    await client.set(key, val, lifetime);
    logger.debug(`${FILE}::Cache stored`, { key, val, lifetime });
    if (isEmpty(singleton)) {
      logger.debug(`${FILE}::Ending cache connection`);
      await client.disconnect();
      logger.debug(`${FILE}::Ended cache connection`);
    }
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
    const client = ec();
    await client.delete(key);
    logger.debug(`${FILE}::Key deleted from cache`, { key });
    if (isEmpty(singleton)) {
      logger.debug(`${FILE}::Ending cache connection`);
      await client.disconnect();
      logger.debug(`${FILE}::Ended cache connection`);
    }
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
    const client = ec();
    await client.deleteMulti(keys);
    logger.debug(`${FILE}::Keys deleted from cache`, { keys });
    if (isEmpty(singleton)) {
      logger.debug(`${FILE}::Ending cache connection`);
      await client.disconnect();
      logger.debug(`${FILE}::Ended cache connection`);
    }
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
    logger.debug(`${FILE}::Ending cache connection`);
    await ec().disconnect();
    logger.debug(`${FILE}::Ended cache connection`);

    if (!isEmpty(Object.keys(singleton))) {
      Object.keys(singleton).forEach(key => {
        delete singleton[key];
      });
    }
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
  pConnect,
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
