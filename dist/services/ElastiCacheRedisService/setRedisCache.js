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
const FILE = 'lesgo.services.ElastiCacheRedis.setRedisCache';
const setRedisCache = (key, value, opts, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const input = validateFields({ key, value }, [
      { key: 'key', type: 'string', required: true },
      { key: 'value', type: 'any', required: true },
    ]);
    opts = Object.assign({ EX: 300 }, opts);
    const client = yield getElastiCacheRedisClient(clientOpts);
    try {
      // @ts-ignore
      const resp = yield client.set(input.key, input.value, 'EX', opts.EX);
      logger.debug(`${FILE}::RECEIVED_RESPONSE`, { resp, input, value });
      return resp;
    } catch (err) {
      throw new LesgoException(
        'Failed to set redis cache',
        `${FILE}::SET_ERROR`,
        500,
        {
          err,
          input,
          value,
          opts,
          clientOpts,
        }
      );
    }
  });
export default setRedisCache;
