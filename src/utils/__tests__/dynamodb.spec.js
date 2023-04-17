import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import dynamodb from '../dynamodb';

describe('test dynamodb utils instantiate', () => {
  it('should not throw error on instantiating DynamoDb', () => {
    const db = dynamodb;

    const ddbClient = new DynamoDBClient({ region: 'ap-southeast-1' });
    const client = DynamoDBDocumentClient.from(ddbClient);

    expect(db.client.config.apiVersion).toEqual(client.config.apiVersion);
  });
});
