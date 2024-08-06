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
import { singleton } from '../RDSAuroraMySQLProxyService/getMySQLProxyClient';
const FILE =
  'lesgo.services.RDSAuroraMySQLProxyService.disconnectMySQLProxyClient';
const disconnectMySQLProxyClient = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    logger.debug(`${FILE}::PREPARING_TO_DISCONNECT`, {
      singletonConns: Object.keys(singleton),
    });
    Object.keys(singleton).forEach(singletonConn =>
      __awaiter(void 0, void 0, void 0, function* () {
        try {
          yield singleton[singletonConn].end();
          delete singleton[singletonConn];
          logger.debug(`${FILE}::COMPLETED`, { singletonConn });
        } catch (err) {
          logger.error(`${FILE}::ERROR`, { singletonConn, err });
        }
      })
    );
  });
export default disconnectMySQLProxyClient;
