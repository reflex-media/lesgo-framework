// eslint-disable-next-line import/no-extraneous-dependencies
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import LesgoException from '../exceptions/LesgoException';
import isEmpty from '../utils/isEmpty';

export default class SQSService {
  constructor(
    opts = {
      region: null,
    },
    queues = {}
  ) {
    let options = {};
    if (!isEmpty(opts.region)) {
      options = { ...options, region: opts.region };
    }

    this.sqsClient = new SQSClient({
      ...{ ...options },
    });

    this.queues = queues;
  }

  /**
   * Sends a payload to the queue
   *
   * @param {object} payload
   * @param {string} queueName
   */
  async dispatch(payload, queueName) {
    if (isEmpty(payload)) {
      throw new LesgoException(
        'payload is undefined in dispatch()',
        'SQSSERVICE_DISPATCH_PAYLOAD_UNDEFINED'
      );
    }

    if (isEmpty(queueName)) {
      throw new LesgoException(
        'queueName is undefined in dispatch()',
        'SQSSERVICE_DISPATCH_QUEUENAME_UNDEFINED'
      );
    }

    const queue = this.queues[queueName];

    try {
      const data = await this.sqsClient.send(
        new SendMessageCommand({
          MessageBody: JSON.stringify(payload),
          QueueUrl: `${queue.url}`,
        })
      );
      return data;
    } catch (error) {
      throw new LesgoException(
        'Error occurred sending message to queue',
        'SQSSERVICE_DISPATCH_ERROR',
        500,
        {
          error,
          payload,
          queueName,
        }
      );
    }
  }
}
