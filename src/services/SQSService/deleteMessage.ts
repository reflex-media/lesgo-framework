import {
  DeleteMessageCommand,
  DeleteMessageCommandInput,
} from '@aws-sdk/client-sqs';
import LesgoException from '../../exceptions/LesgoException';
import { logger, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import getClient from './getClient';
import getQueueUrl, { Queue } from './getQueueUrl';

const FILE = 'lesgo.services.SQSService.deleteMessage';

export interface DeleteMessageOptions
  extends Partial<
    Omit<DeleteMessageCommandInput, 'QueueUrl' | 'ReceiptHandle'>
  > {
  QueueUrl?: string;
  ReceiptHandle?: string;
}

const deleteMessage = async (
  queue: string | Queue,
  receiptHandle: string,
  opts?: DeleteMessageOptions,
  clientOpts?: ClientOptions
) => {
  const queueUrl = getQueueUrl(queue);

  const input = validateFields({ receiptHandle }, [
    { key: 'receiptHandle', type: 'string', required: true },
  ]);

  const client = getClient(clientOpts);

  const commandInput: DeleteMessageCommandInput = {
    QueueUrl: queueUrl,
    ReceiptHandle: input.receiptHandle,
    ...opts,
  };

  try {
    await client.send(new DeleteMessageCommand(commandInput));
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
};

export default deleteMessage;
