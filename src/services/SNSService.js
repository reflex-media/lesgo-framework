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
  async sendSMS(toNumber, message, messageAttrs = {}) {
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

  async checkIfPhoneNumberIsOptedOut(phoneNumber) {
    return (
      await this.snsClient
        .checkIfPhoneNumberIsOptedOut({
          phoneNumber,
        })
        .promise()
    ).isOptedOut;
  }

  createTopic(name, attributes, tags) {
    return this.snsClient
      .createTopic({
        Name: name,
        Attributes: attributes,
        Tags: Object.keys(tags).map(key => ({
          Key: key,
          Value: tags[key],
        })),
      })
      .promise();
  }

  listTopics(nextToken) {
    const params = {};
    if (nextToken) {
      params.NextToken = nextToken;
    }

    return this.snsClient.listTopics(params).promise();
  }

  deleteTopic(topicArn) {
    return this.snsClient
      .deleteTopic({
        TopicArn: topicArn,
      })
      .promise();
  }

  async getTopicAttributes(topicArn) {
    const data = await this.snsClient
      .getTopicAttributes({
        TopicArn: topicArn,
      })
      .promise();

    return data.Attributes;
  }

  setTopicAttributes(topicArn, attributes) {
    return Promise.all(
      Object.keys(attributes).map(key =>
        this.snsClient
          .setTopicAttributes({
            TopicArn: topicArn,
            AttributeName: key,
            AttributeValue: attributes[key],
          })
          .promise()
      )
    );
  }

  async sendNotification(targetArn, message, attributes = {}) {
    try {
      return await this.snsClient
        .publish({
          Message: message,
          TargetArn: targetArn,
          MessageAttributes: Object.keys(attributes).reduce(
            (acc, key) => ({
              ...acc,
              [key]: {
                DataType: 'String',
                StringValue: attributes[key],
              },
            }),
            {}
          ),
        })
        .promise();
    } catch (error) {
      throw new LesgoException(
        'sending to Topic via SNS Class failed',
        `SNSSERVICE_SENDING_TO_TOPIC_FAILED`,
        500,
        error
      );
    }
  }

  subscribe(topicArn, attributes, options) {
    return this.snsClient.subscribe({
      TopicArn: topicArn,
      Attributes: attributes,
      ...options,
    });
  }

  listSubscriptionsByTopic(topicArn, nextToken) {
    const params = {
      TopicArn: topicArn,
    };
    if (nextToken) {
      params.NextToken = nextToken;
    }

    return this.snsClient.listSubscriptionsByTopic(params).promise();
  }

  unsubscribe(subArn) {
    return this.snsClient.unsubscribe({ SubscriptionArn: subArn }).promise();
  }
}
