// eslint-disable-next-line import/no-extraneous-dependencies
import { SQS } from 'aws-sdk';
import { aws } from '../config';

export default class SQSService {
  constructor(
    opts = {
      accessKeyId: null,
      secretAccessKey: null,
      region: null,
    }
  ) {
    let options = {};

    if (opts.accessKeyId !== null && opts.accessKeyId !== undefined) {
      options = { ...options, accessKeyId: opts.accessKeyId };
    }
    if (opts.secretAccessKey !== null && opts.secretAccessKey !== undefined) {
      options = { ...options, secretAccessKey: opts.secretAccessKey };
    }
    if (opts.region !== null && opts.region !== undefined) {
      options = { ...options, region: opts.region };
    }

    this.sqsClient = new SQS({
      ...{ ...options },
    });
  }

  /**
   * Sends a payload to the queue
   *
   * @param {object} payload
   * @param {string} queueName
   */
  dispatch(payload, queueName) {
    if (payload === undefined) {
      throw new Error('payload is undefined in dispatch()');
    }

    if (queueName === undefined) {
      throw new Error('queueName is undefined in dispatch()');
    }

    const queue = aws.sqs.queues[queueName];

    return this.sqsClient
      .sendMessage({
        MessageBody: JSON.stringify(payload),
        QueueUrl: `${queue.url}`,
      })
      .promise();
  }
}
