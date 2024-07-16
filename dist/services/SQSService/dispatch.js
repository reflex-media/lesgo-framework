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
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import getClient from './getClient';
const FILE = 'lesgo.services.SQSService.dispatch';
const dispatch = (
  payload,
  queue,
  {
    region,
    singletonConn,
    fifo = false,
    messageGroupId = '',
    messageDeduplicationId = '',
  }
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const client = getClient({ region, singletonConn });
    const opts = {
      MessageBody: JSON.stringify(payload),
      QueueUrl: queue.url,
    };
    if (fifo) {
      opts.MessageGroupId = messageGroupId;
      opts.MessageDeduplicationId = messageDeduplicationId;
    }
    try {
      const data = yield client.send(new SendMessageCommand(opts));
      logger.debug(`${FILE}::MESSAGE_SENT_TO_QUEUE`, {
        opts,
        payload,
        queue,
      });
      return data;
    } catch (error) {
      throw new LesgoException(
        'Error occurred sending message to queue',
        `${FILE}::SEND_MESSAGE_ERROR`,
        500,
        {
          error,
          payload,
          queue,
          opts,
        }
      );
    }
  });
export default dispatch;
