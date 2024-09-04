import {
  ReceiveMessageCommand,
  ReceiveMessageCommandInput,
} from '@aws-sdk/client-sqs';
import LesgoException from '../../exceptions/LesgoException';
import { logger } from '../../utils';
import { ClientOptions } from '../../types/aws';
import getClient from './getClient';
import getQueueUrl, { Queue } from './getQueueUrl';

const FILE = 'lesgo.services.SQSService.receiveMessages';

export interface ReceiveMessagesOptions
  extends Partial<Omit<ReceiveMessageCommandInput, 'QueueUrl'>> {
  QueueUrl?: string;
}

const receiveMessages = async (
  queue: string | Queue,
  opts?: ReceiveMessagesOptions,
  clientOpts?: ClientOptions
) => {
  const queueUrl = getQueueUrl(queue);

  const client = getClient(clientOpts);

  const commandInput: ReceiveMessageCommandInput = {
    QueueUrl: queueUrl,
    ...opts,
  };

  try {
    const data = await client.send(new ReceiveMessageCommand(commandInput));
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
};

export default receiveMessages;
