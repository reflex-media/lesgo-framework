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
import { DeleteMessageCommand } from '@aws-sdk/client-sqs';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import getClient from './getClient';
const FILE = 'lesgo.services.SQSService.deleteMessage';
const deleteMessage = (queue, receiptHandle, { region, singletonConn }) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const client = getClient({ region, singletonConn });
    const opts = {
      QueueUrl: queue.url,
      ReceiptHandle: receiptHandle,
    };
    try {
      yield client.send(new DeleteMessageCommand(opts));
      logger.debug(`${FILE}::MESSAGE_DELETED_FROM_QUEUE`, {
        opts,
        queue,
      });
    } catch (error) {
      throw new LesgoException(
        'Error occurred deleting message from queue',
        `${FILE}::DELETE_MESSAGE_ERROR`,
        500,
        {
          error,
          queue,
          opts,
        }
      );
    }
  });
export default deleteMessage;
