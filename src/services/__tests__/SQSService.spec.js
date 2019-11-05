import { SQS } from 'aws-sdk';
import SQSService from '../SQSService';
import { aws } from '../../config';

describe('ServicesGroup: test SQSService instantiation', () => {
  it('test instantiate default SQSService', () => {
    // eslint-disable-next-line no-unused-vars
    const sqs = new SQSService();

    expect(SQS).toHaveBeenCalledWith({});
  });

  it('test instantiate SQSService with custom options', () => {
    // eslint-disable-next-line no-unused-vars
    const sqs = new SQSService({
      accessKeyId: 'aws.sqs.options.accessKeyId',
      secretAccessKey: 'aws.sqs.options.secretAccessKey',
      region: 'aws.sqs.options.region',
    });

    expect(SQS).toHaveBeenCalledWith({
      accessKeyId: 'aws.sqs.options.accessKeyId',
      secretAccessKey: 'aws.sqs.options.secretAccessKey',
      region: 'aws.sqs.options.region',
    });
  });
});

describe('ServicesGroup: test SQSService usage', () => {
  it('test dispatch', () => {
    // eslint-disable-next-line no-unused-vars
    const sqs = new SQSService({}, aws.sqs.queues);

    return expect(
      sqs.dispatch({ someData: 'someValue' }, 'pingQueue')
    ).resolves.toMatchObject({
      MessageId: 'MessageId',
      mocked: {
        opts: {},
        params: {
          MessageBody: '{"someData":"someValue"}',
          QueueUrl: `${aws.sqs.queues.pingQueue.url}`,
        },
      },
    });
  });
});
