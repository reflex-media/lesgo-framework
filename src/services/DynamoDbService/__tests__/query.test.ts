import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import query from '../query';
import getClient from '../getClient';
import { LesgoException } from '../../../exceptions';

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
    const tableName = 'testingTable';
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
    const tableName = 'testingTable';
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

    expect(result).toEqual(mockData);
  });

  it('should throw an error if the table is not found', async () => {
    const tableName = 'myTable';
    const keyConditionExpression = 'id = :id';
    const expressionAttributeValues = { ':id': '123' };
    const clientOpts = {
      region: 'us-west-2',
      singletonConn: 'default',
    };

    await expect(
      query(
        tableName,
        keyConditionExpression,
        expressionAttributeValues,
        undefined,
        clientOpts
      )
    ).rejects.toThrow(new LesgoException('Table not found'));
  });

  it('should throw an error if the query fails', async () => {
    const tableName = 'testingTable';
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
    ).rejects.toThrow(new LesgoException('Failed to query'));
  });
});
