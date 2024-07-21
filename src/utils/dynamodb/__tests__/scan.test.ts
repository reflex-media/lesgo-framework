import scan from '../scan';
import scanService from '../../../services/DynamoDbService/scan';

jest.mock('../../../services/DynamoDbService/scan');

describe('scan', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const tableName = 'testingTable';
  const region = 'us-west-2';
  const singletonConn = 'default';

  it('should call scanService with correct parameters', async () => {
    const clientOpts = {
      region,
      singletonConn,
    };

    await scan(tableName, undefined, clientOpts);

    expect(scanService).toHaveBeenCalledWith(tableName, {
      region,
      singletonConn,
    });
  });

  it('should return the result from scanService', async () => {
    const clientOpts = {
      region,
      singletonConn,
    };

    const mockScanResult = [{ id: '1', name: 'John' }];
    (scanService as jest.Mock).mockResolvedValueOnce(mockScanResult);

    const result = await scan(tableName, undefined, clientOpts);

    expect(result).toEqual(mockScanResult);
  });
});
