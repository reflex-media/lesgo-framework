import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import LesgoException from '../exceptions/LesgoException';
import logger from '../utils/logger';
import isEmpty from '../utils/isEmpty';

const FILE = 'lesgo/services/DynamoDbService';

export default class DynamoDbService {
  constructor(opts = {}) {
    this.client = null;
    this.connect(opts);
  }

  connect(opts) {
    const { region } = opts;

    if (!region) {
      throw new LesgoException(
        'Missing required parameter region',
        'DYNAMODB_MISSING_PARAMETER',
        500,
        { opts }
      );
    }

    const ddbClient = new DynamoDBClient({ region });
    this.client = DynamoDBDocumentClient.from(ddbClient);
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

    logger.debug(`${FILE}::PREPARING_QUERY`, { params });

    try {
      const data = await this.client.send(new QueryCommand(params));
      logger.debug(`${FILE}::RECEIVED_QUERY_RESPONSE`, { data });
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

    logger.debug(`${FILE}::PREPARING_QUERY_COUNT`, { params });

    try {
      const data = await this.client.send(new QueryCommand(params));
      logger.debug(`${FILE}::RECEIVED_QUERY_COUNT_RESPONSE`, { data });
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

    logger.debug(`${FILE}::PREPARING_PUT`, { params });

    try {
      const data = await this.client.send(new PutCommand(params));
      logger.debug(`${FILE}::RECEIVED_PUT_RESPONSE`, { data });
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

  async update(
    tableName,
    key,
    updateExpression,
    expressionAttributeValues,
    opts = {}
  ) {
    const params = this.prepareUpdatePayload(
      tableName,
      key,
      updateExpression,
      expressionAttributeValues,
      opts
    );

    logger.debug(`${FILE}::PREPARING_UPDATE`, { params });

    try {
      const data = await this.client.send(new UpdateCommand(params));
      logger.debug(`${FILE}::RECEIVED_UPDATE_RESPONSE`, { data });
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
    expressionAttributeValues,
    opts
  ) {
    let payload = {
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    if (!isEmpty(opts.conditionExpression)) {
      payload = {
        ...payload,
        ConditionExpression: opts.conditionExpression,
      };
    }

    return payload;
  }
}
