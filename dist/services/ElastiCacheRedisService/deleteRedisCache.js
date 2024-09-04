var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { logger, validateFields } from '../../utils';
import { LesgoException } from '../../exceptions';
import getElastiCacheRedisClient from './getElastiCacheRedisClient';
const FILE = 'lesgo.services.ElastiCacheRedis.deleteRedisCache';
const deleteRedisCache = (key, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const input = validateFields({ key }, [
      { key: 'key', type: 'string', required: true },
    ]);
    const client = yield getElastiCacheRedisClient(clientOpts);
    let resp;
    try {
      resp = yield client.del(input.key);
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { resp, input });
      return resp;
    } catch (err) {
      throw new LesgoException(
        'Failed to delete redis cache',
        `${FILE}::DELETE_ERROR`,
        500,
        {
          err,
          input,
          clientOpts,
        }
      );
    }
  });
export default deleteRedisCache;
