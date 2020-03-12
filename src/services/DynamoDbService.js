// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from 'aws-sdk';
import dynamoose from 'dynamoose';

class DynamoDbService {
  constructor() {
    // eslint-disable-next-line new-cap
    const ddb = new AWS.DynamoDB();

    dynamoose.setDDB(ddb);
    this.client = dynamoose;
  }
}

export default DynamoDbService;
