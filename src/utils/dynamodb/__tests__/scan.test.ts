import scan, { ScanOptions } from '../scan';
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
    const opts: ScanOptions = {
      region,
      singletonConn,
    };

    await scan(tableName, opts);

    expect(scanService).toHaveBeenCalledWith(tableName, {
      region,
      singletonConn,
    });
  });

  it('should return the result from scanService', async () => {
    const opts: ScanOptions = {
      region,
      singletonConn,
    };

    const mockScanResult = [{ id: '1', name: 'John' }];
    (scanService as jest.Mock).mockResolvedValueOnce(mockScanResult);

    const result = await scan(tableName, opts);

    expect(result).toEqual(mockScanResult);
  });
});
