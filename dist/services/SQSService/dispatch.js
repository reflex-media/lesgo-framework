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
import { logger, validateFields } from '../../utils';
import getClient from './getClient';
import getQueueUrl from './getQueueUrl';
const FILE = 'lesgo.services.SQSService.dispatch';
const dispatch = (payload, queue, opts, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const queueUrl = getQueueUrl(queue);
    const input = validateFields({ payload }, [
      { key: 'payload', type: 'object', required: true },
    ]);
    const client = getClient(clientOpts);
    const commandInput = Object.assign(Object.assign({}, opts), {
      MessageBody: JSON.stringify(input.payload),
      QueueUrl: queueUrl,
    });
    try {
      const data = yield client.send(new SendMessageCommand(commandInput));
      logger.debug(`${FILE}::MESSAGE_SENT_TO_QUEUE`, {
        data,
        commandInput,
      });
      return data;
    } catch (error) {
      throw new LesgoException(
        'Error occurred sending message to queue',
        `${FILE}::SEND_MESSAGE_ERROR`,
        500,
        {
          error,
          commandInput,
          opts,
        }
      );
    }
  });
export default dispatch;
