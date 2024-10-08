import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { logger, isEmpty, validateFields } from '../../utils';
import { secretsmanager as secretsmanagerConfig } from '../../config';
const FILE = 'lesgo.services.SecretsManager.getClient';
const singleton = {};
const getClient = (clientOpts = {}) => {
  const options = validateFields(clientOpts, [
    { key: 'region', type: 'string', required: false },
    { key: 'singletonConn', type: 'string', required: false },
  ]);
  const region = options.region || secretsmanagerConfig.region;
  const singletonConn = options.singletonConn || 'default';
  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
      singletonConn,
      region,
    });
    return singleton[singletonConn];
  }
  const client = new SecretsManagerClient({ region });
  logger.debug(`${FILE}::NEW_CLIENT`, {
    singletonConn,
    region,
  });
  singleton[singletonConn] = client;
  return client;
};
export default getClient;
