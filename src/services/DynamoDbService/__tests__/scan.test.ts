import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../../exceptions/LesgoException';
import getClient from '../getClient';
import scan from '../scan';

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

  it('should call getClient with correct parameters', async () => {
    const clientOpts = {
      region,
      singletonConn,
    };

    await scan(tableName, undefined, clientOpts);

    expect(getClient).toHaveBeenCalledWith(clientOpts);
  });

  it('should return the scanned items', async () => {
    const clientOpts = {
      region,
      singletonConn,
    };

    const result = await scan(tableName, undefined, clientOpts);

    expect(result).toEqual(mockScanCommandResponse);
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

    await expect(scan(tableName, undefined, opts)).rejects.toThrow(
      LesgoException
    );
  });
});
