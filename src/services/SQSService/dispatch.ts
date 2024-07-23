import {
  SendMessageCommand,
  SendMessageCommandInput,
} from '@aws-sdk/client-sqs';
import LesgoException from '../../exceptions/LesgoException';
import { logger, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import getClient from './getClient';
import getQueueUrl, { Queue } from './getQueueUrl';

const FILE = 'lesgo.services.SQSService.dispatch';

const dispatch = async (
  payload: Record<any, any>,
  queue: string | Queue,
  opts?: SendMessageCommandInput,
  clientOpts?: ClientOptions
) => {
  const queueUrl = getQueueUrl(queue);

  const input = validateFields({ payload }, [
    { key: 'payload', type: 'object', required: true },
  ]);

  const client = getClient(clientOpts);

  const commandInput: SendMessageCommandInput = {
    MessageBody: JSON.stringify(input.payload),
    QueueUrl: queueUrl,
    ...opts,
  };

  try {
    const data = await client.send(new SendMessageCommand(commandInput));
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
};

export default dispatch;
