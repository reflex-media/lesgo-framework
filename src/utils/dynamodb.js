import config from 'config/aws'; // eslint-disable-line import/no-unresolved
import DynamoDbService from '../services/DynamoDbService';

const dynamodb = new DynamoDbService({ region: config.region });

export default dynamodb;
