import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import logger from '../../utils/logger';
import isEmpty from '../../utils/isEmpty';
const FILE = 'lesgo.services.SecretsManager.getClient';
const singleton = {};
const getClient = ({ region, singletonConn }) => {
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
