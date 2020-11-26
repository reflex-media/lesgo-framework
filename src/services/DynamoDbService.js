import { DocumentClient } from 'aws-sdk/clients/dynamodb'; // eslint-disable-line import/no-extraneous-dependencies
import LesgoException from '../exceptions/LesgoException';
import logger from '../utils/logger';

export default class DynamoDb {
  constructor(opts = {}) {
    this.client = null;
    this.connect(opts);
  }

  connect(opts) {
    const { region } = opts;

    if (!region)
      throw new LesgoException(
        'Missing required parameter region',
        'DYNAMODB_MISSING_PARAMETER',
        500,
        { opts }
      );

    this.client = new DocumentClient({ region });
  }

  async query(
    tableName,
    keyConditionExpression,
    expressionAttributeValues,
    projectionExpression
  ) {
    const params = this.prepareQueryPayload(
      tableName,
      keyConditionExpression,
      expressionAttributeValues,
      projectionExpression
    );

    logger.info('PREPARING TO QUERY DYNAMODB', { params });

    try {
      const data = await this.client.query(params).promise();
      logger.info('RECEIVED RESPONSE FROM DYNAMODB', { data });
      return data.Items;
    } catch (err) {
      throw new LesgoException(
        'EXCEPTION ENCOUNTERED FOR DYNAMODB QUERY OPERATION',
        'DYNAMODB_QUERY_EXCEPTION',
        500,
        { err, params }
      );
    }
  }

  async queryCount(
    tableName,
    keyConditionExpression,
    expressionAttributeValues
  ) {
    const params = this.prepareQueryCountPayload(
      tableName,
      keyConditionExpression,
      expressionAttributeValues
    );

    logger.info('PREPARING TO QUERY COUNT DYNAMODB', { params });

    try {
      const data = await this.client.query(params).promise();
      logger.info('RECEIVED RESPONSE FROM DYNAMODB', { data });
      return data.Count;
    } catch (err) {
      throw new LesgoException(
        'EXCEPTION ENCOUNTERED FOR DYNAMODB QUERY COUNT OPERATION',
        'DYNAMODB_QUERY_COUNT_EXCEPTION',
        500,
        { err, params }
      );
    }
  }

  async put(tableName, item) {
    const params = this.preparePutPayload(tableName, item);

    logger.info('PREPARING TO PUT ITEM TO DYNAMODB', { params });

    try {
      const data = await this.client.put(params).promise();
      logger.info('RECEIVED RESPONSE FROM DYNAMODB', { data });
      return data;
    } catch (err) {
      throw new LesgoException(
        'EXCEPTION ENCOUNTERED FOR DYNAMODB PUT OPERATION',
        'DYNAMODB_PUT_EXCEPTION',
        500,
        { err, params }
      );
    }
  }

  async update(tableName, key, updateExpression, expressionAttributeValues) {
    const params = this.prepareUpdatePayload(
      tableName,
      key,
      updateExpression,
      expressionAttributeValues
    );

    logger.info('PREPARING TO UPDATE ITEM ON DYNAMODB', { params });

    try {
      const data = await this.client.update(params).promise();
      logger.info('RECEIVED RESPONSE FROM DYNAMODB', { data });
      return data;
    } catch (err) {
      throw new LesgoException(
        'EXCEPTION ENCOUNTERED FOR DYNAMODB UPDATE OPERATION',
        'DYNAMODB_UPDATE_EXCEPTION',
        500,
        { err, params }
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  prepareQueryPayload(
    tableName,
    keyConditionExpression,
    expressionAttributeValues,
    projectionExpression
  ) {
    return {
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ProjectionExpression: projectionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  prepareQueryCountPayload(
    tableName,
    keyConditionExpression,
    expressionAttributeValues
  ) {
    return {
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      Select: 'COUNT',
    };
  }

  // eslint-disable-next-line class-methods-use-this
  preparePutPayload(tableName, item) {
    return {
      TableName: tableName,
      Item: item,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  prepareUpdatePayload(
    tableName,
    key,
    updateExpression,
    expressionAttributeValues
  ) {
    return {
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    };
  }
}
