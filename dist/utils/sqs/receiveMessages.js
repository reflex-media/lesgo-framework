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
import { LesgoException } from '../../exceptions';
import config from '../../config/aws';
import receiveMessagesService from '../../services/SQSService/receiveMessages';
import isEmpty from '../isEmpty';
import validateFields from '../validateFields';
import logger from '../logger';
const FILE = 'lesgo.utils.sqs.receiveMessages';
export const receiveMessages = (queue, opts = {}) =>
  __awaiter(void 0, void 0, void 0, function* () {
    logger.debug(`${FILE}::RECEIVE_MESSAGES_PARAMETERS`, {
      queue,
      opts,
    });
    opts.region = isEmpty(opts.region) ? config.sqs.region : opts.region;
    opts.singletonConn = isEmpty(opts.singletonConn)
      ? 'default'
      : opts.singletonConn;
    const input = validateFields(opts, [
      { key: 'region', type: 'string', required: true },
      { key: 'singletonConn', type: 'string', required: true },
      { key: 'maxNumberOfMessages', type: 'number', required: false },
      { key: 'waitTimeSeconds', type: 'number', required: false },
    ]);
    logger.debug(`${FILE}::VALIDATED_INPUT`, {
      input,
    });
    if (typeof queue === 'string') {
      const configQueue = config.sqs.queues.find(q => q.alias === queue);
      if (!configQueue) {
        throw new LesgoException(
          `Queue with alias ${queue} not found in config`,
          `${FILE}::QUEUE_NOT_FOUND`,
          500,
          {
            queue,
          }
        );
      }
      queue = configQueue;
    }
    return receiveMessagesService(queue, {
      region: input.region,
      singletonConn: input.singletonConn,
      maxNumberOfMessages: input.maxNumberOfMessages,
      waitTimeSeconds: input.waitTimeSeconds,
    });
  });
export default receiveMessages;
