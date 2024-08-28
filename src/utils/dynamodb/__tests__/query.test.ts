import { query } from '../../dynamodb';
import queryService from '../../../services/DynamoDbService/query';

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

    await query(
      tableName,
      keyConditionExpression,
      expressionAttributeValues,
      undefined,
      {
        region,
        singletonConn,
      }
    );

    expect(queryService).toHaveBeenCalledWith(
      tableName,
      keyConditionExpression,
      expressionAttributeValues,
      undefined,
      {
        region,
        singletonConn,
      }
    );
  });

  it('should return empty array if no results', async () => {
    const tableName = 'testingTable';
    const keyConditionExpression = 'id = :id';
    const expressionAttributeValues = { ':id': '123' };

    (queryService as jest.Mock).mockResolvedValue({});

    const resp = await query(
      tableName,
      keyConditionExpression,
      expressionAttributeValues
    );

    expect(resp.length).toEqual(0);
  });
});
