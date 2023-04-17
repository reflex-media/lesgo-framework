import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { mockClient } from 'aws-sdk-client-mock';
import { dispatch } from '../queue';
import LesgoException from '../../exceptions/LesgoException';

const sqsMock = mockClient(SQSClient);

describe('UtilsGroup: test queue utils', () => {
  it('test queue.dispatch', () => {
    sqsMock.on(SendMessageCommand).resolves({
      MessageId: 'MessageId',
    });

    return expect(
      dispatch({ someData: 'someValue' }, 'pingQueue')
    ).resolves.toMatchObject({
      MessageId: 'MessageId',
    });
  });

  it('test queue dispatch with empty payload', () => {
    return expect(dispatch()).rejects.toThrow(
      new LesgoException(
        'payload is undefined in dispatch()',
        'SQSSERVICE_DISPATCH_PAYLOAD_UNDEFINED'
      )
    );
  });

  it('test queue dispatch with empty queueName', () => {
    return expect(dispatch({ someData: 'someValue' })).rejects.toThrow(
      new LesgoException(
        'queueName is undefined in dispatch()',
        'SQSSERVICE_DISPATCH_QUEUENAME_UNDEFINED'
      )
    );
  });
});
