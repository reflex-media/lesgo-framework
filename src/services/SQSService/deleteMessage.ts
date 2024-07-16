import {
  DeleteMessageCommand,
  DeleteMessageCommandInput,
} from '@aws-sdk/client-sqs';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import getClient from './getClient';

const FILE = 'lesgo.services.SQSService.deleteMessage';

export type Queue = {
  alias: string;
  name: string;
  url: string;
};

const deleteMessage = async (
  queue: Queue,
  receiptHandle: string,
  {
    region,
    singletonConn,
  }: {
    region: string;
    singletonConn: string;
  }
) => {
  const client = getClient({ region, singletonConn });

  const opts: DeleteMessageCommandInput = {
    QueueUrl: queue.url,
    ReceiptHandle: receiptHandle,
  };

  try {
    await client.send(new DeleteMessageCommand(opts));
    logger.debug(`${FILE}::MESSAGE_DELETED_FROM_QUEUE`, {
      opts,
      queue,
    });
  } catch (error) {
    throw new LesgoException(
      'Error occurred deleting message from queue',
      `${FILE}::DELETE_MESSAGE_ERROR`,
      500,
      {
        error,
        queue,
        opts,
      }
    );
  }
};

export default deleteMessage;
