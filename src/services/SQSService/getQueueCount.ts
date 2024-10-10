import {
  GetQueueAttributesCommand,
  GetQueueAttributesCommandInput,
} from '@aws-sdk/client-sqs';
import LesgoException from '../../exceptions/LesgoException';
import { logger } from '../../utils';
import { ClientOptions } from '../../types/aws';
import getClient from './getClient';
import getQueueUrl, { Queue } from './getQueueUrl';

const FILE = 'lesgo.services.SQSService.getQueueCount';

export interface GetQueueCountOptions
  extends Partial<Omit<GetQueueAttributesCommandInput, 'QueueUrl'>> {
  QueueUrl?: string;
}

const getQueueCount = async (
  queue: string | Queue,
  opts?: GetQueueCountOptions,
  clientOpts?: ClientOptions
) => {
  const queueUrl = getQueueUrl(queue);
  const client = getClient(clientOpts);

  const commandInput: GetQueueAttributesCommandInput = {
    QueueUrl: queueUrl,
    AttributeNames: [
      'ApproximateNumberOfMessages',
      'ApproximateNumberOfMessagesNotVisible',
    ],
    ...opts,
  };

  try {
    const data = await client.send(new GetQueueAttributesCommand(commandInput));
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
};

export default getQueueCount;
