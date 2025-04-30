import { SQSClient } from '@aws-sdk/client-sqs';
import { logger, isEmpty, validateFields } from '../../utils';
import { sqs as sqsConfig } from '../../config';
const FILE = 'lesgo.services.SQSService.getClient';
const singleton = {};
const getClient = (clientOpts = {}) => {
  const options = validateFields(clientOpts, [
    { key: 'region', type: 'string', required: false },
    { key: 'singletonConn', type: 'string', required: false },
  ]);
  const region = options.region || sqsConfig.region;
  const singletonConn = options.singletonConn || 'default';
  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
      singletonConn,
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
