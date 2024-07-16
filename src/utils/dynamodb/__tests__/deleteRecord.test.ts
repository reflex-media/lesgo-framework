import deleteRecord from '../../../utils/dynamodb/deleteRecord';
import deleteRecordService from '../../../services/DynamoDbService/deleteRecord';

jest.mock('../../../services/DynamoDbService/deleteRecord');

describe('deleteRecord', () => {
  const tableName = 'testingTable';
  const region = 'ap-southeast-1';
  const singletonConn = 'default';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call deleteRecordService with the correct parameters', async () => {
    const key = { id: '123' };

    await deleteRecord(key, tableName, { region, singletonConn });

    expect(deleteRecordService).toHaveBeenCalledWith(key, tableName, {
      region,
      singletonConn,
    });
  });
});
