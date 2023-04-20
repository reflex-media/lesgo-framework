import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import getClient from './getClient';

const FILE = 'services/MemcacheElastiCacheService/setKey';

const setKey = async (key, value, ttl, opts) => {
  const client = getClient(opts);

  try {
    if (typeof ttl === 'undefined') {
      await client.set(key, value);
    } else {
      await client.set(key, value, ttl);
    }

    logger.debug(`${FILE}::CACHE_SET`, { key, value, ttl });
  } catch (err) {
    throw new LesgoException('Failed to set key', `${FILE}::FAILED`, 500, {
      err,
      key,
      value,
      ttl,
      opts,
    });
  }
};

export default setKey;
