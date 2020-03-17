import dynamoose from 'dynamoose';

class DynamoDbService {
  constructor() {
    this.client = dynamoose;
  }
}

export default DynamoDbService;
