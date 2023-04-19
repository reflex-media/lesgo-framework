// eslint-disable-next-line import/no-extraneous-dependencies
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import LesgoException from '../../exceptions/LesgoException';
import isEmpty from '../../utils/isEmpty';
import getClient from './getClient';

const FILE = 'services/SQSService/dispatch';

const dispatch = async (payload, queueName, { region, queues }) => {
  if (isEmpty(payload)) {
    throw new LesgoException('payload is empty', `${FILE}::EMPTY_PAYLOAD`);
  }

  if (isEmpty(queueName)) {
    throw new LesgoException('queueName is empty', `${FILE}::EMPTY_QUEUE_NAME`);
  }

  const queue = queues[queueName];
  const client = getClient({ region }, 'default');

  try {
    const data = await client.send(
      new SendMessageCommand({
        MessageBody: JSON.stringify(payload),
        QueueUrl: `${queue.url}`,
      })
    );
    return data;
  } catch (error) {
    throw new LesgoException(
      'Error occurred sending message to queue',
      `${FILE}::SEND_MESSAGE_ERROR`,
      500,
      {
        error,
        payload,
        queueName,
      }
    );
  }
};

export default dispatch;
