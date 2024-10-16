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
import { GetQueueAttributesCommand } from '@aws-sdk/client-sqs';
import LesgoException from '../../exceptions/LesgoException';
import { logger } from '../../utils';
import getClient from './getClient';
import getQueueUrl from './getQueueUrl';
const FILE = 'lesgo.services.SQSService.getQueueCount';
const getQueueCount = (queue, opts, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const queueUrl = getQueueUrl(queue);
    const client = getClient(clientOpts);
    const commandInput = Object.assign(
      {
        QueueUrl: queueUrl,
        AttributeNames: [
          'ApproximateNumberOfMessages',
          'ApproximateNumberOfMessagesNotVisible',
        ],
      },
      opts
    );
    try {
      const data = yield client.send(
        new GetQueueAttributesCommand(commandInput)
      );
      logger.debug(`${FILE}::QUEUE_COUNT`, {
        data,
        commandInput,
      });
      return data;
    } catch (error) {
      throw new LesgoException(
        'Error occurred getting count from queue',
        `${FILE}::QUEUE_COUNT_ERROR`,
        500,
        {
          error,
          commandInput,
          opts,
        }
      );
    }
  });
export default getQueueCount;
