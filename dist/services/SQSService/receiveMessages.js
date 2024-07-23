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
import { logger } from '../../utils';
import getClient from './getClient';
import getQueueUrl from './getQueueUrl';
const FILE = 'lesgo.services.SQSService.receiveMessages';
const receiveMessages = (queue, opts, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const queueUrl = getQueueUrl(queue);
    const client = getClient(clientOpts);
    const commandInput = Object.assign(Object.assign({}, opts), {
      QueueUrl: queueUrl,
    });
    try {
      const data = yield client.send(new ReceiveMessageCommand(commandInput));
      logger.debug(`${FILE}::MESSAGES_RECEIVED_FROM_QUEUE`, {
        data,
        commandInput,
      });
      return data;
    } catch (error) {
      throw new LesgoException(
        'Error occurred receiving messages from queue',
        `${FILE}::RECEIVE_MESSAGES_ERROR`,
        500,
        {
          error,
          commandInput,
          opts,
        }
      );
    }
  });
export default receiveMessages;
