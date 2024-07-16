import { DeleteCommand, DeleteCommandInput } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../../exceptions/LesgoException';
import logger from '../../../utils/logger';
import config from '../../../config/aws';
import getClient from '../getClient';
import deleteRecord, { Key } from '../deleteRecord';
import DynamoDbService from '../../DynamoDbService';

jest.mock('../getClient', () => {
  return jest.fn().mockImplementation(() => ({
    send: jest.fn().mockImplementation(command => {
      if (command instanceof DeleteCommand) {
        return Promise.resolve(command.input);
      }

      return Promise.reject(new Error('Command not mocked'));
    }),
  }));
});
jest.mock('../../../utils/logger');

describe('deleteRecord', () => {
  const tableName = 'testingTable';
  const region = 'ap-southeast-1';
  const singletonConn = 'default';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete the record successfully', async () => {
    const key: Key = { id: '123' };
    const input: DeleteCommandInput = {
      TableName: config.dynamodb.tables.find(t => t.alias === tableName)?.name,
      Key: key,
    };

    const result = await deleteRecord(key, tableName, {
      region,
      singletonConn,
    });

    expect(getClient).toHaveBeenCalledWith({ singletonConn, region });
    expect(result).toEqual(input);
  });

  it('should throw an exception when failed to delete the record', async () => {
    const key: Key = { id: '123' };
    const input: DeleteCommandInput = {
      TableName: config.dynamodb.tables.find(t => t.alias === tableName)?.name,
      Key: key,
    };
    const error = new Error('Failed to delete record');
    const client = {
      send: jest.fn().mockRejectedValue(error),
    };
    (getClient as jest.Mock).mockReturnValue(client);

    await expect(
      DynamoDbService.deleteRecord(key, tableName, { region, singletonConn })
    ).rejects.toThrow(
      new LesgoException(
        'Failed to delete record',
        'lesgo.services.DynamoDbService.deleteRecord::ERROR',
        500,
        {
          err: error,
          input,
        }
      )
    );

    expect(getClient).toHaveBeenCalledWith({ singletonConn, region });
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.DynamoDbService.deleteRecord::QUERY_PREPARED',
      { input }
    );
  });
});
