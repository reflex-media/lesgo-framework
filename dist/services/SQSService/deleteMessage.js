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
import { logger, validateFields } from '../../utils';
import getClient from './getClient';
import getQueueUrl from './getQueueUrl';
const FILE = 'lesgo.services.SQSService.deleteMessage';
const deleteMessage = (queue, receiptHandle, opts, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const queueUrl = getQueueUrl(queue);
    const input = validateFields({ receiptHandle }, [
      { key: 'receiptHandle', type: 'string', required: true },
    ]);
    const client = getClient(clientOpts);
    const commandInput = Object.assign(Object.assign({}, opts), {
      QueueUrl: queueUrl,
      ReceiptHandle: input.receiptHandle,
    });
    try {
      yield client.send(new DeleteMessageCommand(commandInput));
      logger.debug(`${FILE}::MESSAGE_DELETED_FROM_QUEUE`, {
        commandInput,
      });
    } catch (error) {
      throw new LesgoException(
        'Error occurred deleting message from queue',
        `${FILE}::DELETE_MESSAGE_ERROR`,
        500,
        {
          error,
          commandInput,
          opts,
        }
      );
    }
  });
export default deleteMessage;
