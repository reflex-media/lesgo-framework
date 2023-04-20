import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import { deleteClientSingleton } from './getClient';

const FILE = 'services/MemcacheElastiCacheService/disconnect';

const disconnect = async client => {
  try {
    await client.disconnect();
    deleteClientSingleton();
    logger.debug(`${FILE}::CLIENT_DISCONNECTED`);
  } catch (err) {
    throw new LesgoException(
      'Failed to disconnect client',
      `${FILE}::FAILED`,
      500,
      {
        err,
        client,
      }
    );
  }
};

export default disconnect;
