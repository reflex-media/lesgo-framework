import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../../exceptions/LesgoException';
import logger from '../../../utils/logger';
import config from '../../../config/aws';
import getClient from '../getClient';
import updateRecord, { Key } from '../updateRecord';
import DynamoDbService from '../../DynamoDbService';

jest.mock('../getClient', () => {
  return jest.fn().mockImplementation(() => ({
    send: jest.fn().mockImplementation(command => {
      if (command instanceof UpdateCommand) {
        return Promise.resolve(command.input);
      }

      return Promise.reject(new Error('Command not mocked'));
    }),
  }));
});
jest.mock('../../../utils/logger');

describe('updateRecord', () => {
  const tableName = 'testingTable';
  const region = 'ap-southeast-1';
  const singletonConn = 'default';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the record successfully', async () => {
    const key: Key = { id: '123' };
    const updateExpression = 'SET #name = :name';
    const expressionAttributeValues = { ':name': 'John Doe' };
    const input: UpdateCommandInput = {
      TableName: config.dynamodb.tables.find(t => t.alias === tableName)?.name,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    const result = await updateRecord(key, tableName, {
      region,
      singletonConn,
      updateExpression,
      expressionAttributeValues,
    });

    expect(getClient).toHaveBeenCalledWith({ singletonConn, region });
    expect(result).toEqual(input);
  });

  it('should throw an exception when failed to update the record', async () => {
    const key: Key = { id: '123' };
    const updateExpression = 'SET #name = :name';
    const expressionAttributeValues = { ':name': 'John Doe' };
    const input: UpdateCommandInput = {
      TableName: config.dynamodb.tables.find(t => t.alias === tableName)?.name,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    };
    const error = new Error('Failed to update record');
    const client = {
      send: jest.fn().mockRejectedValue(error),
    };
    (getClient as jest.Mock).mockReturnValue(client);

    await expect(
      DynamoDbService.updateRecord(key, tableName, {
        region,
        singletonConn,
        updateExpression,
        expressionAttributeValues,
      })
    ).rejects.toThrow(
      new LesgoException(
        'Failed to update record',
        'lesgo.services.DynamoDbService.updateRecord::ERROR',
        500,
        {
          err: error,
          params: input,
        }
      )
    );

    expect(getClient).toHaveBeenCalledWith({ singletonConn, region });
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.DynamoDbService.updateRecord::QUERY_PREPARED',
      { params: input }
    );
  });
});
