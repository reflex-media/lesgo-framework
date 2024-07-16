import {
  ReceiveMessageCommand,
  ReceiveMessageCommandInput,
} from '@aws-sdk/client-sqs';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import getClient from './getClient';

const FILE = 'lesgo.services.SQSService.receiveMessages';

export type Queue = {
  alias: string;
  name: string;
  url: string;
};

const receiveMessages = async (
  queue: Queue,
  {
    region,
    singletonConn,
    maxNumberOfMessages = 1,
    waitTimeSeconds = 3,
  }: {
    region: string;
    singletonConn: string;
    maxNumberOfMessages?: number;
    waitTimeSeconds?: number;
  }
) => {
  const client = getClient({ region, singletonConn });

  const opts: ReceiveMessageCommandInput = {
    QueueUrl: queue.url,
    MaxNumberOfMessages: maxNumberOfMessages,
    WaitTimeSeconds: waitTimeSeconds,
  };

  try {
    const data = await client.send(new ReceiveMessageCommand(opts));
    logger.debug(`${FILE}::MESSAGES_RECEIVED_FROM_QUEUE`, {
      data,
      opts,
      queue,
    });
    return data;
  } catch (error) {
    throw new LesgoException(
      'Error occurred receiving messages from queue',
      `${FILE}::RECEIVE_MESSAGES_ERROR`,
      500,
      {
        error,
        queue,
        opts,
      }
    );
  }
};

export default receiveMessages;
