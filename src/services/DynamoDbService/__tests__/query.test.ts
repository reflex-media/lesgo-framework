import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import query, { prepareQueryInput } from '../query';
import getClient from '../getClient';

jest.mock('../getClient', () => {
  return jest.fn().mockImplementation(() => ({
    send: jest.fn().mockImplementation(command => {
      if (command instanceof QueryCommand) {
        return Promise.resolve(command);
      }

      return Promise.reject(new Error('Command not mocked'));
    }),
  }));
});
jest.mock('../../../utils/logger');

describe('query', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getClient with the correct options', async () => {
    const tableName = 'myTable';
    const keyConditionExpression = 'id = :id';
    const expressionAttributeValues = { ':id': '123' };
    const clientOpts = {
      region: 'us-west-2',
      singletonConn: 'default',
    };

    await query(
      tableName,
      keyConditionExpression,
      expressionAttributeValues,
      undefined,
      clientOpts
    );

    expect(getClient).toHaveBeenCalledTimes(1);
    expect(getClient).toHaveBeenCalledWith(clientOpts);
  });

  it('should return the items from the response', async () => {
    const tableName = 'myTable';
    const keyConditionExpression = 'id = :id';
    const expressionAttributeValues = { ':id': '123' };
    const clientOpts = {
      region: 'us-west-2',
      singletonConn: 'default',
    };

    const mockItems = [{ id: '123', name: 'John' }];
    const mockData = {
      Items: mockItems,
    };
    const mockSend = jest.fn().mockResolvedValue(mockData);
    const mockClient = {
      send: mockSend,
    };
    (getClient as jest.Mock).mockReturnValue(mockClient);

    const result = await query(
      tableName,
      keyConditionExpression,
      expressionAttributeValues,
      undefined,
      clientOpts
    );

    expect(result).toEqual(mockItems);
  });

  it('should throw an error if the query fails', async () => {
    const tableName = 'myTable';
    const keyConditionExpression = 'id = :id';
    const expressionAttributeValues = { ':id': '123' };
    const clientOpts = {
      region: 'us-west-2',
      singletonConn: 'default',
    };

    const mockError = new Error('Query failed');
    const mockSend = jest.fn().mockRejectedValue(mockError);
    const mockClient = {
      send: mockSend,
    };
    (getClient as jest.Mock).mockReturnValue(mockClient);

    await expect(
      query(
        tableName,
        keyConditionExpression,
        expressionAttributeValues,
        undefined,
        clientOpts
      )
    ).rejects.toThrowError('Failed to query');
  });
});

describe('prepareQueryInput', () => {
  it('should return the prepared query input', () => {
    const tableName = 'testingTable';
    const keyConditionExpression = 'id = :id';
    const expressionAttributeValues = { ':id': '123' };
    const opts = {
      projectionExpression: 'name',
      expressionAttributeNames: { '#n': 'name' },
      filterExpression: 'age > :age',
      indexName: 'index',
      select: 'ALL_ATTRIBUTES',
    };

    const result = prepareQueryInput({
      tableName,
      keyConditionExpression,
      expressionAttributeValues,
      ...opts,
    });

    expect(result).toEqual({
      TableName: expect.any(String),
      KeyConditionExpression: expect.any(String),
      ExpressionAttributeValues: expect.any(Object),
      ProjectionExpression: expect.any(String),
      ExpressionAttributeNames: expect.any(Object),
      FilterExpression: expect.any(String),
      IndexName: expect.any(String),
      Select: expect.any(String),
    });
  });
});
