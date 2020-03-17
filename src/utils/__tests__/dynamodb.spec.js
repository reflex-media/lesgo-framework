import dynamoose from 'dynamoose';
import dynamodb from '../dynamodb';

describe('UtilsGroup: test dynamodb utils', () => {
  it('test dynamodb utils', () => {
    expect(dynamodb()).toBe(dynamoose);
    // Get client the second time should not create new instance
    expect(dynamodb()).toBe(dynamoose);
  });
});
