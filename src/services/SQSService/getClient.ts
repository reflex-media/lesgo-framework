import { SQSClient } from '@aws-sdk/client-sqs';
import { logger, isEmpty, validateFields } from '../../utils';
import { sqs as sqsConfig } from '../../config';
import { ClientOptions } from '../../types/aws';

const FILE = 'lesgo.services.SQSService.getClient';

interface Singleton {
  [key: string]: SQSClient;
}

const singleton: Singleton = {};

const getClient = (clientOpts: ClientOptions = {}) => {
  const options = validateFields(clientOpts, [
    { key: 'region', type: 'string', required: false },
    { key: 'singletonConn', type: 'string', required: false },
  ]);

  const region = options.region || sqsConfig.region;
  const singletonConn = options.singletonConn || 'default';

  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
      region,
    });
    return singleton[singletonConn];
  }

  const client = new SQSClient({ region });
  logger.debug(`${FILE}::NEW_CLIENT`, {
    region,
  });

  singleton[singletonConn] = client;

  return client;
};

export default getClient;
