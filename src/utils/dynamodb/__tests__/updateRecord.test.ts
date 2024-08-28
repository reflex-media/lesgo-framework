import { updateRecord } from '../../dynamodb';
import updateRecordService from '../../../services/DynamoDbService/updateRecord';

jest.mock('../../../services/DynamoDbService/updateRecord');

describe('updateRecord', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call updateRecordService with the correct parameters', async () => {
    const key = { id: '123' };
    const tableName = 'testingTable';
    const updateExpression = 'SET #name = :name';
    const expressionAttributeValues = { ':name': 'John Doe' };
    const opts = {
      ConditionExpression: 'attribute_exists(id)',
      ExpressionAttributeNames: { '#name': 'name' },
    };
    const clientOpts = {
      region: 'ap-southeast-1',
      singletonConn: 'default',
    };

    await updateRecord(
      key,
      tableName,
      updateExpression,
      expressionAttributeValues,
      opts,
      clientOpts
    );

    expect(updateRecordService).toHaveBeenCalledWith(
      key,
      tableName,
      updateExpression,
      expressionAttributeValues,
      opts,
      clientOpts
    );
  });

  it('should use default region if region is empty', async () => {
    const key = { id: '123' };
    const tableName = 'testingTable';
    const updateExpression = 'SET #name = :name';
    const expressionAttributeValues = { ':name': 'John Doe' };
    const clientOpts = {
      singletonConn: 'default',
    };

    await updateRecord(
      key,
      tableName,
      updateExpression,
      expressionAttributeValues,
      undefined,
      clientOpts
    );

    expect(updateRecordService).toHaveBeenCalledWith(
      key,
      tableName,
      updateExpression,
      expressionAttributeValues,
      undefined,
      clientOpts
    );
  });
});
