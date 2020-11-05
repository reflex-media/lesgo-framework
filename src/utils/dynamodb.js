import config from 'Config/aws'; // eslint-disable-line import/no-unresolved
import DynamoDbService from '../services/DynamoDbService';

const dynamodb = new DynamoDbService({ region: config.region });

export default dynamodb;
