import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { mockClient } from 'aws-sdk-client-mock';
import aws from 'config/aws'; // eslint-disable-line import/no-unresolved
import LesgoException from '../../exceptions/LesgoException';
import SQSService from '../SQSService';

const sqsMock = mockClient(SQSClient);

describe('ServicesGroup: test SQSService usage', () => {
  it('test dispatch', () => {
    sqsMock.on(SendMessageCommand).resolves({
      MessageId: 'MessageId',
    });

    const sqs = new SQSService({}, aws.sqs.queues);

    return expect(
      sqs.dispatch({ someData: 'someValue' }, 'pingQueue')
    ).resolves.toMatchObject({
      MessageId: 'MessageId',
    });
  });

  it('test dispatch with default constructor', () => {
    sqsMock.on(SendMessageCommand).rejects(
      new Error(
        'Some Error',
        'SOME_ERROR'
      )
    );

    const sqs = new SQSService();

    return expect(
      sqs.dispatch({ someData: 'someValue' }, 'pingQueue')
    ).rejects.toMatchObject(new LesgoException(
      'Error occurred sending message to queue',
      'SQSSERVICE_DISPATCH_ERROR',
      500,
    ));
  });

  it('test dispatch with custom region set', () => {
    sqsMock.on(SendMessageCommand).resolves({
      MessageId: 'MessageId',
    });

    const sqs = new SQSService({ region: 'us-west-2' }, aws.sqs.queues);

    return expect(
      sqs.dispatch({ someData: 'someValue' }, 'pingQueue')
    ).resolves.toMatchObject({
      MessageId: 'MessageId',
    });
  });

  it('test dispatch with empty payload', () => {
    const sqs = new SQSService({}, aws.sqs.queues);

    return expect(
      sqs.dispatch({}, 'pingQueue')
    ).rejects.toMatchObject(
      new LesgoException(
        'payload is undefined in dispatch()',
        'SQSSERVICE_DISPATCH_PAYLOAD_UNDEFINED'
      )
    );
  });

  it('test dispatch with empty queue name', () => {
    const sqs = new SQSService({}, aws.sqs.queues);

    return expect(
      sqs.dispatch({ someData: 'someValue' })
    ).rejects.toMatchObject(
      new LesgoException(
        'queueName is undefined in dispatch()',
        'SQSSERVICE_DISPATCH_QUEUENAME_UNDEFINED'
      )
    );
  });

  it('test dispatch thrown exception', () => {
    sqsMock.on(SendMessageCommand).rejects(
      new Error(
        'Some Error',
        'SOME_ERROR'
      )
    );

    const sqs = new SQSService({}, aws.sqs.queues);

    return expect(
      sqs.dispatch({ someData: 'someValue' }, 'pingQueue')
    ).rejects.toMatchObject(new LesgoException(
      'Error occurred sending message to queue',
      'SQSSERVICE_DISPATCH_ERROR',
      500,
    ));
  });
});
