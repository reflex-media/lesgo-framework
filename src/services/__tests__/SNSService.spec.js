import { SNS } from 'aws-sdk';
import SNSService from '../SNSService';

describe('ServicesGroup: test SNSService instantiation', () => {
  it('test instantiate default SNSService', () => {
    // eslint-disable-next-line no-unused-vars
    const sns = new SNSService();

    expect(SNS).toHaveBeenCalledWith({});
  });

  it('test instantiate SNSService with custom options', () => {
    // eslint-disable-next-line no-unused-vars
    const sns = new SNSService({
      accessKeyId: 'aws.sns.options.accessKeyId',
      secretAccessKey: 'aws.sns.options.secretAccessKey',
      region: 'aws.sns.options.region',
    });

    expect(SNS).toHaveBeenCalledWith({
      accessKeyId: 'aws.sns.options.accessKeyId',
      secretAccessKey: 'aws.sns.options.secretAccessKey',
      region: 'aws.sns.options.region',
    });
  });
});

describe('ServicesGroup: test SNSService sms usage', () => {
  it('test sendSMS', () => {
    const sns = new SNSService({});

    return expect(
      sns.sendSMS('+18444170832', 'Hi there! This is a message', {
        smsType: 'Transactional',
        originationNumber: '+18779305975',
      })
    ).resolves.toMatchObject({
      MessageId: 'MessageId',
      mocked: {
        opts: {},
        params: {
          Message: 'Hi there! This is a message',
          PhoneNumber: '+18444170832',
          MessageAttributes: {
            'AWS.SNS.SMS.SMSType': {
              DataType: 'String',
              StringValue: 'Transactional',
            },
            'AWS.MM.SMS.OriginationNumber': {
              DataType: 'String',
              StringValue: '+18779305975',
            },
          },
        },
      },
    });
  });

  it('should throw error when sendSMS fails', async () => {
    const sns = new SNSService({});

    try {
      expect(
        await sns.sendSMS('+18444170832', 'throw', {
          smsType: 'Transactional',
          originationNumber: '+18779305975',
        })
      ).toThrow();
    } catch (err) {
      expect(err.name).toEqual('LesgoException');
      expect(err.code).toEqual('SNSSERVICE_SENDING_SMS_FAILED');
    }
  });

  test('getSMSAttributes', async () => {
    const sns = new SNSService({});

    expect(await sns.getSMSAttributes()).toMatchObject({
      key: 'value',
    });
  });

  test('setSMSAttributes', async () => {
    const sns = new SNSService({});

    expect(
      await sns.setSMSAttributes({
        DefaultSMSType: 'Transactional',
        DefaultSenderID: 'SenderID',
      })
    ).toStrictEqual({
      mocked: {
        attributes: {
          DefaultSMSType: 'Transactional',
          DefaultSenderID: 'SenderID',
        },
      },
    });
  });
});

describe('ServicesGroup: test SNSService setDefaultSenderId', () => {
  it('should be able to use the default sender ID', async () => {
    const sns = new SNSService({});

    await sns.setDefaultSenderId('SenderID');

    return expect(sns.snsClient.setSMSAttributes).toHaveBeenCalledWith({
      attributes: {
        DefaultSenderID: 'SenderID',
      },
    });
  });

  it('should return false when the default sender id is already the current passed to', async () => {
    const sns = new SNSService({});

    sns.snsClient.getSMSAttributes.mockImplementationOnce(() => {
      return {
        promise: jest.fn().mockImplementation(() => {
          return new Promise(resolve => {
            const response = {
              attributes: {
                DefaultSenderID: 'SenderID',
              },
            };
            resolve(response);
          });
        }),
      };
    });

    return expect(await sns.setDefaultSenderId('SenderID')).toBe(false);
  });
});

describe('ServicesGroup: test SNSService checkIfPhoneNumberIsOptedOut', () => {
  it('should be able to check if a phone number is opted out', async () => {
    const sns = new SNSService({});

    expect(await sns.checkIfPhoneNumberIsOptedOut('+639161212121212')).toBe(
      true
    );
  });
});

describe('ServicesGroup: test SNSService createTopic', () => {
  it('should be able to create a topic', async () => {
    const sns = new SNSService({});

    expect(
      await sns.createTopic(
        'my-topic',
        { FifoTopic: true },
        { service: 'my-service' }
      )
    ).toStrictEqual({
      TopicArn: 'arn:121212/my-topic',
      mocked: {
        Name: 'my-topic',
        Attributes: { FifoTopic: true },
        Tags: [
          {
            Key: 'service',
            Value: 'my-service',
          },
        ],
      },
    });
  });
});

describe('ServicesGroup: test SNSService listTopics', () => {
  it('should be able to list first 100 topics', async () => {
    const sns = new SNSService({});

    expect(await sns.listTopics()).toStrictEqual({
      Topics: [
        { TopicArn: 'arn:121212/my-topic' },
        { TopicArn: 'arn:232323/my-topic1' },
      ],
      NextToken: 'next-token',
    });
  });

  it('should be able to list next 100 topics from the next token', async () => {
    const sns = new SNSService({});

    expect(await sns.listTopics('next-token')).toStrictEqual({
      Topics: [{ TopicArn: 'arn:343434/my-topic2' }],
    });
  });
});

describe('ServicesGroup: test SNSService getTopicAttributes', () => {
  it('should be able to get the topic attributes', async () => {
    const sns = new SNSService({});

    expect(await sns.getTopicAttributes('arn:1234')).toStrictEqual({
      DisplayName: 'Test Topic: arn:1234',
    });
  });
});

describe('ServicesGroup: test SNSService deleteTopic', () => {
  it('should be able to delete a topic and pass the correct arguments', async () => {
    const sns = new SNSService({});

    expect(await sns.deleteTopic('arn:1234')).toStrictEqual({
      mocked: {
        TopicArn: 'arn:1234',
      },
    });
  });
});

describe('ServicesGroup: test SNSService setTopicAttributes', () => {
  it('should be able to call all needed functions', async () => {
    const sns = new SNSService({});

    expect(
      await sns.setTopicAttributes('arn:1234', {
        DeliveryPolicy: 'https',
        DisplayName: 'SMS',
      })
    ).toStrictEqual([
      {
        mocked: {
          TopicArn: 'arn:1234',
          AttributeName: 'DeliveryPolicy',
          AttributeValue: 'https',
        },
      },
      {
        mocked: {
          TopicArn: 'arn:1234',
          AttributeName: 'DisplayName',
          AttributeValue: 'SMS',
        },
      },
    ]);
  });
});

describe('ServicesGroup: test SNSService sendToTopic', () => {
  it('should be able to send correct parameters', async () => {
    const sns = new SNSService({});

    expect(
      await sns.sendToTopic('arn:1234', 'This is a message', {
        Owner: '1234',
        ConfirmationWasAuthenticated: true,
      })
    ).toStrictEqual({
      ResponseMetadata: {
        RequestId: 'RequestId',
      },
      MD5OfMessageBody: 'MD5OfMessageBody',
      MessageId: 'MessageId',
      mocked: {
        opts: {},
        params: {
          Message: 'This is a message',
          TopicArn: 'arn:1234',
          MessageAttributes: {
            Owner: {
              DataType: 'String',
              StringValue: '1234',
            },
            ConfirmationWasAuthenticated: {
              DataType: 'String',
              StringValue: true,
            },
          },
        },
      },
    });
  });

  it('should throw error when sendToTopic fails', async () => {
    const sns = new SNSService({});

    try {
      expect(
        await sns.sendToTopic('arn:1234', 'throw', { Owner: '1234' })
      ).toThrow();
    } catch (err) {
      expect(err.name).toEqual('LesgoException');
      expect(err.code).toEqual('SNSSERVICE_SENDING_TO_TOPIC_FAILED');
    }
  });
});

describe('ServicesGroup: test SNSService subscribe', () => {
  it('should be able to send correct parameters and additional options', async () => {
    const sns = new SNSService({});

    await sns.subscribe(
      'arn:1234',
      {
        Owner: '1234',
        ConfirmationWasAuthenticated: true,
      },
      {
        Protocol: 'ftp',
      }
    );

    expect(sns.snsClient.subscribe).toHaveBeenCalledWith({
      TopicArn: 'arn:1234',
      Attributes: {
        Owner: '1234',
        ConfirmationWasAuthenticated: true,
      },
      Protocol: 'ftp',
    });
  });
});

describe('ServicesGroup: test SNSService unsubscribe', () => {
  it('should be able to call correct arguments to unsubscribe', async () => {
    const sns = new SNSService({});

    await sns.unsubscribe('arn:1234');

    expect(sns.snsClient.unsubscribe).toHaveBeenCalledWith({
      SubscriptionArn: 'arn:1234',
    });
  });
});

describe('ServicesGroup: test SNSService listSubscriptionsByTopic', () => {
  it('should be able to list first 100 subscriptions', async () => {
    const sns = new SNSService({});

    expect(await sns.listSubscriptionsByTopic('arn:1234')).toStrictEqual({
      Subscriptions: [
        { SubscriptionArn: 'arn:121212/my-sub' },
        { SubscriptionArn: 'arn:232323/my-sub1' },
      ],
      NextToken: 'next-token',
    });
  });

  it('should be able to list next 100 subscriptions from the next token', async () => {
    const sns = new SNSService({});

    expect(
      await sns.listSubscriptionsByTopic('arn:1234', 'next-token')
    ).toStrictEqual({
      Subscriptions: [{ SubscriptionArn: 'arn:343434/my-sub2' }],
    });
  });
});
