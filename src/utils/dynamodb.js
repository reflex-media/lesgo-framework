import config from 'Config/aws'; // eslint-disable-line import/no-unresolved
import DynamoDbService from '../services/DynamoDbService';

const dynamodb = (opts = {}) => {
  const { region } = opts;

  return new DynamoDbService(!region ? region : config.region);
};

export default dynamodb;
