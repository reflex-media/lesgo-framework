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
import { ChangeMessageVisibilityCommand } from '@aws-sdk/client-sqs';
import LesgoException from '../../exceptions/LesgoException';
import { logger, validateFields } from '../../utils';
import getClient from './getClient';
import getQueueUrl from './getQueueUrl';
const FILE = 'lesgo.services.SQSService.changeMessageVisibility';
const changeMessageVisibility = (
  queue,
  receiptHandle,
  visibilityTimeout,
  opts,
  clientOpts
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const queueUrl = getQueueUrl(queue);
    const input = validateFields({ receiptHandle, visibilityTimeout }, [
      { key: 'receiptHandle', type: 'string', required: true },
      { key: 'visibilityTimeout', type: 'number', required: true },
    ]);
    const client = getClient(clientOpts);
    const commandInput = Object.assign(
      {
        QueueUrl: queueUrl,
        ReceiptHandle: input.receiptHandle,
        VisibilityTimeout: input.visibilityTimeout,
      },
      opts
    );
    try {
      yield client.send(new ChangeMessageVisibilityCommand(commandInput));
      logger.debug(`${FILE}::MESSAGE_VISIBILITY_UPDATED`, {
        commandInput,
      });
    } catch (error) {
      throw new LesgoException(
        'Error occurred updating message visibility timeout',
        `${FILE}::MESSAGE_VISIBILITY_TIMEOUT_UPDATED_ERROR`,
        500,
        {
          error,
          commandInput,
          opts,
        }
      );
    }
  });
export default changeMessageVisibility;
