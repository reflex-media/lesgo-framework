import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import getClient from './getClient';

const FILE = 'services/MemcacheElastiCacheService/deleteKey';

const deleteKey = async (key, opts) => {
  const client = getClient(opts);

  try {
    await client.delete(key);
    logger.debug(`${FILE}::CACHE_KEY_DELETED`, { key });
  } catch (err) {
    throw new LesgoException('Failed to delete key', `${FILE}::FAILED`, 500, {
      err,
      key,
    });
  }
};

export default deleteKey;
