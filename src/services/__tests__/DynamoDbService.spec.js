import dynamoose from 'dynamoose';
import DynamoDbService from '../DynamoDbService';

describe('ServicesGroup: test DynamoDbService', () => {
  it('test instantiate default DynamoDbService', () => {
    const db = new DynamoDbService();
    expect(db.client).toEqual(dynamoose);
  });
});
