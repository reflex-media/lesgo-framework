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
