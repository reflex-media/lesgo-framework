import { Client } from '@opensearch-project/opensearch';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import createAwsConnector from './createAwsConnector';
import logger from '../../utils/logger';

const FILE = 'services/OpenSearchService/getClient';

const singleton = [];

const getClient = async ({ region, host }, singletonConn) => {
  if (singleton[singletonConn]) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
      client: singleton[singletonConn],
    });
    return singleton[singletonConn];
  }

  const credentials = await defaultProvider()();
  logger.debug(`${FILE}::CREDENTIALS`, { credentials });

  const awsConnector = createAwsConnector(credentials, region);
  const client = new Client({
    ...awsConnector,
    node: host,
  });

  singleton[singletonConn] = client;

  logger.debug(`${FILE}::NEW_CLIENT_SINGLETON`, {
    client: singleton[singletonConn],
  });
  return client;
};

export default getClient;
