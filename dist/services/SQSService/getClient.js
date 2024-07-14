import { SQSClient } from '@aws-sdk/client-sqs';
import logger from '../../utils/logger';
import isEmpty from '../../utils/isEmpty';
const FILE = 'lesgo.services.SQSService.getClient';
const singleton = {};
const getClient = ({ region, singletonConn }) => {
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
