import { S3Client } from '@aws-sdk/client-s3';
import logger from '../../utils/logger';
import isEmpty from '../../utils/isEmpty';
const FILE = 'lesgo/services/S3Service/getClient';
const singleton = {};
const getClient = ({ region, singletonConn }) => {
  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
      client: singleton[singletonConn],
    });
    return singleton[singletonConn];
  }
  const client = new S3Client({ region });
  logger.debug(`${FILE}::NEW_CLIENT`, {
    client: singleton[singletonConn],
  });
  singleton[singletonConn] = client;
  return client;
};
export default getClient;
