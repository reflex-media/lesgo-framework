// eslint-disable-next-line import/no-extraneous-dependencies
import { SQS } from 'aws-sdk';

import { aws } from '../config';
import LesgoException from '../exceptions/LesgoException';

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
      throw new LesgoException(
        'payload is undefined in dispatch()',
        'SQSSERVICE_DISPATCH_PAYLOAD_UNDEFINED'
      );
    }

    if (queueName === undefined) {
      throw new LesgoException(
        'queueName is undefined in dispatch()',
        'SQSSERVICE_DISPATCH_QUEUENAME_UNDEFINED'
      );
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
