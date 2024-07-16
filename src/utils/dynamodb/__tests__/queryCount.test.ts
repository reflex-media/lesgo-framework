import queryCount, { QueryCountOptions } from '../queryCount';
import queryService from '../../../services/DynamoDbService/query';

jest.mock('../../../services/DynamoDbService/query');

describe('queryCount', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call queryService with the correct arguments', async () => {
    const tableName = 'testingTable';
    const keyConditionExpression = 'id = :id';
    const expressionAttributeValues = { ':id': '123' };
    const region = 'ap-southeast-1';
    const singletonConn = 'default';
    const filterExpression = 'attribute_exists(someAttribute)';

    const options: QueryCountOptions = {
      filterExpression,
      singletonConn,
      region,
    };

    await queryCount(
      tableName,
      keyConditionExpression,
      expressionAttributeValues,
      options
    );

    expect(queryService).toHaveBeenCalledWith(
      tableName,
      keyConditionExpression,
      expressionAttributeValues,
      {
        region,
        singletonConn,
        filterExpression,
      }
    );
  });

  it('should call queryService with default options if no options are provided', async () => {
    const tableName = 'testingTable';
    const keyConditionExpression = 'id = :id';
    const expressionAttributeValues = { ':id': '123' };
    const region = 'ap-southeast-1';
    const singletonConn = 'default';

    await queryCount(
      tableName,
      keyConditionExpression,
      expressionAttributeValues
    );

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
