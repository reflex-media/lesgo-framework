import {
  ChangeMessageVisibilityCommand,
  ChangeMessageVisibilityCommandInput,
} from '@aws-sdk/client-sqs';
import LesgoException from '../../exceptions/LesgoException';
import { logger, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import getClient from './getClient';
import getQueueUrl, { Queue } from './getQueueUrl';

const FILE = 'lesgo.services.SQSService.changeMessageVisibility';

export interface changeMessageVisibilityOptions
  extends Partial<
    Omit<
      ChangeMessageVisibilityCommandInput,
      'QueueUrl' | 'ReceiptHandle' | 'VisibilityTimeout'
    >
  > {
  QueueUrl?: string;
  ReceiptHandle?: string;
  VisibilityTimeout?: number;
}

const changeMessageVisibility = async (
  queue: string | Queue,
  receiptHandle: string,
  visibilityTimeout: number,
  opts?: changeMessageVisibilityOptions,
  clientOpts?: ClientOptions
) => {
  const queueUrl = getQueueUrl(queue);

  const input = validateFields({ receiptHandle, visibilityTimeout }, [
    { key: 'receiptHandle', type: 'string', required: true },
    { key: 'visibilityTimeout', type: 'number', required: true },
  ]);

  const client = getClient(clientOpts);

  const commandInput: ChangeMessageVisibilityCommandInput = {
    QueueUrl: queueUrl,
    ReceiptHandle: input.receiptHandle,
    VisibilityTimeout: input.visibilityTimeout,
    ...opts,
  };

  try {
    await client.send(new ChangeMessageVisibilityCommand(commandInput));
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
};

export default changeMessageVisibility;
