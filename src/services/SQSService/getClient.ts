import { SQSClient } from '@aws-sdk/client-sqs';
import logger from '../../utils/logger';
import isEmpty from '../../utils/isEmpty';

const FILE = 'lesgo.services.SQSService.getClient';

interface Singleton {
  [key: string]: SQSClient;
}

const singleton: Singleton = {};

export interface GetClientOptions {
  region: string;
  singletonConn: string;
}

const getClient = ({ region, singletonConn }: GetClientOptions) => {
  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
      client: singleton[singletonConn],
      region,
    });
    return singleton[singletonConn];
  }

  const client = new SQSClient({ region });
  logger.debug(`${FILE}::NEW_CLIENT`, {
    client,
    region,
  });

  singleton[singletonConn] = client;

  return client;
};

export default getClient;
