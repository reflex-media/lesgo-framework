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
import logger from '../utils/logger';
import disconnectOpenConnections from './disconnectOpenConnections';
const FILE = 'lesgo/middlewares/normalizeSQSMessageMiddleware';
export const normalizeSqsHandler = records => {
  let recordCount = 0;
  if (!records || records === null || Object.keys(records).length === 0) {
    recordCount = null;
  } else {
    recordCount = Object.keys(records).length;
  }
  logger.addMeta({ recordCount });
  if (recordCount === null) return null;
  return Object.values(records).map(record =>
    Object.assign(
      { messageId: record.messageId, receiptHandle: record.receiptHandle },
      JSON.parse(record.body)
    )
  );
};
export const disconnectConnections = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      yield disconnectOpenConnections();
    } catch (err) {
      logger.error(`${FILE}::OPEN_CONNECTION_DISCONNECT_FAIL`, err);
    }
  });
/**
 * Normalizes handler.event.Records as handler.event.collections Object.
 * This type of request is received by SQS listeners
 */
const sqsMiddleware = () => {
  return {
    before: (handler, next) => {
      const { Records } = handler.event;
      // @see https://middy.js.org/docs/middlewares/do-not-wait-for-empty-event-loop/
      // eslint-disable-next-line no-param-reassign
      handler.context.callbackWaitsForEmptyEventLoop = false;
      // eslint-disable-next-line no-param-reassign
      handler.event.collection = normalizeSqsHandler(Records);
      next();
    },
    after: (handler, next) =>
      __awaiter(void 0, void 0, void 0, function* () {
        // @see https://middy.js.org/docs/middlewares/do-not-wait-for-empty-event-loop/
        // eslint-disable-next-line no-param-reassign
        handler.context.callbackWaitsForEmptyEventLoop = false;
        yield disconnectConnections();
        next();
      }),
    onError: (handler, next) =>
      __awaiter(void 0, void 0, void 0, function* () {
        // @see https://middy.js.org/docs/middlewares/do-not-wait-for-empty-event-loop/
        // eslint-disable-next-line no-param-reassign
        handler.context.callbackWaitsForEmptyEventLoop = false;
        yield disconnectConnections();
        next();
      }),
  };
};
export default sqsMiddleware;
