import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import getClient from './getClient';

const FILE = 'services/MemcacheElastiCacheService/getKey';

const getKey = async (key, opts) => {
  const client = getClient(opts);

  try {
    const data = await client.get(key);
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
    return data;
  } catch (err) {
    throw new LesgoException('Failed to get key', `${FILE}::FAILED`, 500, {
      err,
      key,
    });
  }
};

export default getKey;
