import putRecord from '../putRecord';
import putRecordService from '../../../services/DynamoDbService/putRecord';

jest.mock('../../../services/DynamoDbService/putRecord');

describe('putRecord', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call putRecordService with the correct arguments', async () => {
    const item = { id: '123', name: 'John Doe' };
    const tableName = 'testingTable';
    const region = 'ap-southeast-1';
    const singletonConn = 'default';

    await putRecord(item, tableName, undefined, { region, singletonConn });

    expect(putRecordService).toHaveBeenCalledWith(item, tableName, undefined, {
      region,
      singletonConn,
    });
  });
});
