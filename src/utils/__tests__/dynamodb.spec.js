import dynamodb from '../dynamodb';

describe('test dynamodb utils instantiate', () => {
  it('should not throw error on instantiating DynamoDb', () => {
    expect(dynamodb.client).toEqual(
      expect.objectContaining({
        mocked: {
          region: 'ap-southeast-1',
        },
      })
    );
  });

  it('should update DynamoDb region on connect', () => {
    dynamodb.connect({
      region: 'us-west-1',
    });

    expect(dynamodb.client).toEqual(
      expect.objectContaining({
        mocked: {
          region: 'us-west-1',
        },
      })
    );
  });
});
