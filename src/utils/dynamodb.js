import DynamoDbService from '../services/DynamoDbService';

const singleton = [];

const dynamodb = (conn = null) => {
  if (singleton[conn]) {
    return singleton[conn];
  }

  const instance = new DynamoDbService().client;

  singleton[conn] = instance;

  return instance;
};

export default dynamodb;
