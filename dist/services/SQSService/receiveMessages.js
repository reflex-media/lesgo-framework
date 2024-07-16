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
import { ReceiveMessageCommand } from '@aws-sdk/client-sqs';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import getClient from './getClient';
const FILE = 'lesgo.services.SQSService.receiveMessages';
const receiveMessages = (
  queue,
  { region, singletonConn, maxNumberOfMessages = 1, waitTimeSeconds = 3 }
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const client = getClient({ region, singletonConn });
    const opts = {
      QueueUrl: queue.url,
      MaxNumberOfMessages: maxNumberOfMessages,
      WaitTimeSeconds: waitTimeSeconds,
    };
    try {
      const data = yield client.send(new ReceiveMessageCommand(opts));
      logger.debug(`${FILE}::MESSAGES_RECEIVED_FROM_QUEUE`, {
        data,
        opts,
        queue,
      });
      return data;
    } catch (error) {
      throw new LesgoException(
        'Error occurred receiving messages from queue',
        `${FILE}::RECEIVE_MESSAGES_ERROR`,
        500,
        {
          error,
          queue,
          opts,
        }
      );
    }
  });
export default receiveMessages;
