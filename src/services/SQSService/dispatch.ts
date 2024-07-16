import {
  SendMessageCommand,
  SendMessageCommandInput,
} from '@aws-sdk/client-sqs';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import getClient from './getClient';

const FILE = 'lesgo.services.SQSService.dispatch';

export type Queue = {
  alias: string;
  name: string;
  url: string;
};

const dispatch = async (
  payload: Record<any, any>,
  queue: Queue,
  {
    region,
    singletonConn,
    fifo = false,
    messageGroupId = '',
    messageDeduplicationId = '',
  }: {
    region: string;
    singletonConn: string;
    fifo?: boolean;
    messageGroupId?: string;
    messageDeduplicationId?: string;
  }
) => {
  const client = getClient({ region, singletonConn });

  const opts: SendMessageCommandInput = {
    MessageBody: JSON.stringify(payload),
    QueueUrl: queue.url,
  };

  if (fifo) {
    opts.MessageGroupId = messageGroupId;
    opts.MessageDeduplicationId = messageDeduplicationId;
  }

  try {
    const data = await client.send(new SendMessageCommand(opts));
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
      }
    );
  }
};

export default dispatch;
