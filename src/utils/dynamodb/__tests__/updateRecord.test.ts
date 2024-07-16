import updateRecord, {
  UpdateRecordOptions,
} from '../../../utils/dynamodb/updateRecord';
import DynamoDbService from '../../../services/DynamoDbService';

jest.mock('../../../services/DynamoDbService/updateRecord');

describe('updateRecord', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call updateRecordService with the correct parameters', async () => {
    const key = { id: '123' };
    const tableName = 'testingTable';
    const options: UpdateRecordOptions = {
      region: 'ap-southeast-1',
      singletonConn: 'default',
      updateExpression: 'SET #name = :name',
      expressionAttributeValues: { ':name': 'John Doe' },
      conditionExpression: 'attribute_exists(id)',
      expressionAttributeNames: { '#name': 'name' },
    };

    await updateRecord(key, tableName, options);

    expect(DynamoDbService.updateRecord).toHaveBeenCalledWith(
      key,
      tableName,
      options
    );
  });

  it('should use default region if region is empty', async () => {
    const key = { id: '123' };
    const tableName = 'testingTable';
    const options: UpdateRecordOptions = {
      singletonConn: 'default',
      updateExpression: 'SET #name = :name',
      expressionAttributeValues: { ':name': 'John Doe' },
    };

    await updateRecord(key, tableName, options);

    expect(DynamoDbService.updateRecord).toHaveBeenCalledWith(key, tableName, {
      ...options,
      region: 'ap-southeast-1',
    });
  });
});
