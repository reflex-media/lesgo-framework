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
import { logger } from '../../utils';
import { singleton } from '../ElastiCacheRedisService/getElastiCacheRedisClient';
const FILE =
  'lesgo.services.ElastiCacheRedisService.disconnectElastiCacheRedisClient';
/**
 * Disconnects the ElastiCache Redis client.
 *
 * It is important to disconnect the ElastiCache Redis client
 * when it is no longer needed to prevent memory leaks and to free up resources,
 * especially for serverless applications on Lambda function.
 *
 * @returns {Promise<void>} A promise that resolves when the disconnection is completed.
 */
const disconnectElastiCacheRedisClient = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const singletonConns = Object.keys(singleton);
    if (singletonConns.length === 0) {
      logger.debug(`${FILE}::NO_CONNECTIONS_TO_DISCONNECT`);
      return;
    }
    logger.debug(`${FILE}::PREPARING_TO_DISCONNECT`, {
      singletonConns,
    });
    singletonConns.forEach(singletonConn =>
      __awaiter(void 0, void 0, void 0, function* () {
        try {
          yield singleton[singletonConn].quit();
          delete singleton[singletonConn];
          logger.debug(`${FILE}::COMPLETED`, { singletonConn });
        } catch (err) {
          logger.error(`${FILE}::ERROR`, { singletonConn, err });
        }
      })
    );
  });
export default disconnectElastiCacheRedisClient;
