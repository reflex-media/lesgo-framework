import query from '../query';
import getClient from '../getClient';
import queryService from '../../../services/DynamoDbService/query';

jest.mock('../getClient');
jest.mock('../../../services/DynamoDbService/query');

describe('query', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call queryService with the correct arguments', async () => {
    const tableName = 'testingTable';
    const keyConditionExpression = 'id = :id';
    const expressionAttributeValues = { ':id': '123' };
    const region = 'ap-southeast-1';
    const singletonConn = 'default';

    await query(tableName, keyConditionExpression, expressionAttributeValues, {
      region,
      singletonConn,
    });

    expect(queryService).toHaveBeenCalledWith(
      tableName,
      keyConditionExpression,
      expressionAttributeValues,
      {
        region,
        singletonConn,
      }
    );
  });
});
