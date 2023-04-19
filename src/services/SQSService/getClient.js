import { SQSClient } from '@aws-sdk/client-sqs';
import logger from '../../utils/logger';

const FILE = 'services/SQSService/getClient';

const singleton = [];

const getClient = ({ region }, singletonConn) => {
  if (singleton[singletonConn]) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
      client: singleton[singletonConn],
      region,
    });
    return singleton[singletonConn];
  }

  const client = new SQSClient({ region });
  logger.debug(`${FILE}::NEW_CLIENT`, {
    client: singleton[singletonConn],
    region,
  });

  return client;
};

export default getClient;
