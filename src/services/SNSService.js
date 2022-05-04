import { SNS } from 'aws-sdk';
import LesgoException from '../exceptions/LesgoException';

export default class SNSService {
  constructor(opts = {}) {
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

    this.snsClient = new SNS({
      ...{ ...options },
    });
  }

  /**
   * Send SMS to the provided number.
   *
   * @param {string} toNumber
   * @param {string} message
   * @param {object} messageAttrs
   */
  async sendSMS(toNumber, message, messageAttrs) {
    const resolvedAttrs = {
      smsType: 'AWS.SNS.SMS.SMSType',
      senderId: 'AWS.SNS.SMS.SenderID',
      originationNumber: 'AWS.MM.SMS.OriginationNumber',
    };
    const attributes = { ...messageAttrs };

    ['smsType', 'senderId', 'originationNumber'].forEach(key => {
      if (attributes[key]) {
        attributes[resolvedAttrs[key]] = {
          DataType: 'String',
          StringValue: attributes[key],
        };
        delete attributes[key];
      }
    });

    try {
      return await this.snsClient
        .publish({
          Message: message,
          PhoneNumber: toNumber,
          MessageAttributes: attributes,
        })
        .promise();
    } catch (error) {
      throw new LesgoException(
        'sending of SMS via SNS Class failed',
        `SNSSERVICE_SENDING_SMS_FAILED`,
        500,
        error
      );
    }
  }

  /**
   * Sets the SMS' DefaultSenderID attribute
   *
   * @param {string} senderId
   */
  async setDefaultSenderId(senderId) {
    const data = await this.getSMSAttributes();

    if (senderId !== data.DefaultSenderID) {
      await this.setSMSAttributes({
        DefaultSenderID: senderId,
      });

      return true;
    }

    return false;
  }

  async getSMSAttributes() {
    const data = await this.snsClient.getSMSAttributes().promise();

    return data.attributes;
  }

  setSMSAttributes(attributes) {
    return this.snsClient
      .setSMSAttributes({
        attributes,
      })
      .promise();
  }
}
