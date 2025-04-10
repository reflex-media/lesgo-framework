import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { isEmpty, logger, validateFields } from '../../utils';
import { dynamodb as dynamodbConfig } from '../../config';
import { DynamoDbClientOptions } from '../../types/aws';

const FILE = 'lesgo.services.DynamoDbService.getClient';

export interface Singleton {
  [key: string]: DynamoDBDocumentClient;
}

const singleton: Singleton = {};

const getClient = (opts: DynamoDbClientOptions = {}) => {
  const options = validateFields(opts, [
    { key: 'region', type: 'string', required: false },
    { key: 'singletonConn', type: 'string', required: false },
    { key: 'retryStrategy', type: 'object', required: false },
  ]);

  const region = options.region || dynamodbConfig.region;
  const singletonConn = options.singletonConn || 'default';
  const retryStrategy = options.retryStrategy;

  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
      client: singleton[singletonConn],
      region,
    });
    return singleton[singletonConn];
  }

  const ddbClient = new DynamoDBClient({ region, retryStrategy });
  const client = DynamoDBDocumentClient.from(ddbClient);

  logger.debug(`${FILE}::NEW_CLIENT_SINGLETON`, {
    client,
    region,
  });

  singleton[singletonConn] = client;

  return client;
};

export default getClient;
