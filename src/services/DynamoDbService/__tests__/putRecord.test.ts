import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../../exceptions/LesgoException';
import logger from '../../../utils/logger';
import dynamodbConfig from '../../../config/dynamodb';
import getClient from '../getClient';
import putRecord, { Item } from '../putRecord';
import DynamoDbService from '../../DynamoDbService';

jest.mock('../getClient', () => {
  return jest.fn().mockImplementation(() => ({
    send: jest.fn().mockImplementation(command => {
      if (command instanceof PutCommand) {
        return Promise.resolve(command.input);
      }

      return Promise.reject(new Error('Command not mocked'));
    }),
  }));
});
jest.mock('../../../utils/logger');

describe('putRecord', () => {
  const tableName = 'testingTable';
  const region = 'ap-southeast-1';
  const singletonConn = 'default';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should put the record successfully', async () => {
    const item: Item = { id: '123', name: 'John Doe' };
    const input: PutCommandInput = {
      TableName: dynamodbConfig.tables.find(t => t.alias === tableName)?.name,
      Item: item,
    };

    const result = await putRecord(item, tableName, { region, singletonConn });

    expect(getClient).toHaveBeenCalledWith({ singletonConn, region });
    expect(result).toEqual(input);
  });

  it('should throw an exception when failed to put the record', async () => {
    const item: Item = { id: '123', name: 'John Doe' };
    const input: PutCommandInput = {
      TableName: dynamodbConfig.tables.find(t => t.alias === tableName)?.name,
      Item: item,
    };
    const error = new Error('Failed to put record');
    const client = {
      send: jest.fn().mockRejectedValue(error),
    };
    (getClient as jest.Mock).mockReturnValue(client);

    await expect(
      DynamoDbService.putRecord(item, tableName, { region, singletonConn })
    ).rejects.toThrow(
      new LesgoException(
        'Failed to put record',
        'lesgo.services.DynamoDbService.putRecord::ERROR',
        500,
        {
          err: error,
          input,
        }
      )
    );

    expect(getClient).toHaveBeenCalledWith({ singletonConn, region });
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.DynamoDbService.putRecord::QUERY_PREPARED',
      { input }
    );
  });
});
