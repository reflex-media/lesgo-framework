import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';

const FILE = 'services/DynamoDbService/connect';

const singleton = [];

const connect = (singletonConn, { region }) => {
  if (singleton[singletonConn]) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`);
    return singleton[singletonConn];
  }

  if (!region) {
    throw new LesgoException(
      'Missing required parameter region',
      `${FILE}::MISSING_OPTS_REGION`,
      500,
      { opts: region }
    );
  }

  const ddbClient = new DynamoDBClient({ region });
  const client = DynamoDBDocumentClient.from(ddbClient);

  singleton[singletonConn] = client;

  logger.debug(`${FILE}::NEW_CLIENT_SINGLETON`);
  return client;
};

export default connect;
