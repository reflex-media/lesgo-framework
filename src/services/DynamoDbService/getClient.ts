import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import logger from '../../utils/logger';
import isEmpty from '../../utils/isEmpty';

const FILE = 'lesgo.services.DynamoDbService.getClient';

export interface Singleton {
  [key: string]: DynamoDBDocumentClient;
}

export interface GetClientOptions {
  region: string;
  singletonConn: string;
}

const singleton: Singleton = {};

const getClient = ({ singletonConn, region }: GetClientOptions) => {
  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
      client: singleton[singletonConn],
      region,
    });
    return singleton[singletonConn];
  }

  const ddbClient = new DynamoDBClient({ region });
  const client = DynamoDBDocumentClient.from(ddbClient);

  logger.debug(`${FILE}::NEW_CLIENT_SINGLETON`, {
    client,
    region,
  });

  singleton[singletonConn] = client;

  return client;
};

export default getClient;
