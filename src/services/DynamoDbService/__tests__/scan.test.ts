import { ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../../exceptions/LesgoException';
import getClient from '../getClient';
import scan, { prepareScanInput } from '../scan';

const mockScanCommandInput: ScanCommandInput = {
  TableName: 'lesgo-testing-testingTable',
  FilterExpression: 'filterExpression',
  ExpressionAttributeValues: { key: 'value' },
  ProjectionExpression: 'projectionExpression',
  ExpressionAttributeNames: { key: 'name' },
  IndexName: 'indexName',
  Select: 'ALL_ATTRIBUTES',
};

const mockScanCommandResponse = {
  Items: [{ id: '1', name: 'John' }],
};

jest.mock('../getClient', () => {
  return jest.fn().mockImplementation(() => ({
    send: jest.fn().mockImplementation(command => {
      if (command instanceof ScanCommand) {
        return Promise.resolve(mockScanCommandResponse);
      }

      return Promise.reject(new Error('Command not mocked'));
    }),
  }));
});
jest.mock('../../../utils/logger');

describe('scan', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const tableName = 'testingTable';
  const region = 'us-west-2';
  const singletonConn = 'default';

  it('should prepare scan input correctly', () => {
    const opts = {
      filterExpression: 'filterExpression',
      expressionAttributeValues: { key: 'value' },
      projectionExpression: 'projectionExpression',
      expressionAttributeNames: { key: 'name' },
      indexName: 'indexName',
      select: 'ALL_ATTRIBUTES',
    };
    const clientOpts = {
      region,
      singletonConn,
    };

    const result = prepareScanInput({ ...opts, ...clientOpts, tableName });

    expect(result).toEqual(mockScanCommandInput);
  });

  it('should call getClient with correct parameters', async () => {
    const clientOpts = {
      region,
      singletonConn,
    };

    await scan(tableName, clientOpts);

    expect(getClient).toHaveBeenCalledWith({
      region,
      singletonConn,
    });
  });

  it('should return the scanned items', async () => {
    const clientOpts = {
      region,
      singletonConn,
    };

    const result = await scan(tableName, clientOpts);

    expect(result).toEqual(mockScanCommandResponse.Items);
  });

  it('should throw LesgoException if scan fails', async () => {
    const opts = {
      region,
      singletonConn,
    };

    const mockError = new Error('Scan failed');
    (getClient as jest.Mock).mockReturnValueOnce({
      send: jest.fn().mockRejectedValue(mockError),
    });

    await expect(scan(tableName, opts)).rejects.toThrow(LesgoException);
  });
});
