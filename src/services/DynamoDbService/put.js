import { PutCommand } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import connect from './connect';
import preparePutPayload from './preparePutPayload';

const FILE = 'services/DynamoDbService/put';

const put = async (tableName, item, { region, singletonConn }) => {
  const params = preparePutPayload(tableName, item);
  logger.debug(`${FILE}::QUERY_PREPARED`, { params });

  const client = connect(singletonConn, { region });

  try {
    const data = await client.send(new PutCommand(params));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
    return data;
  } catch (err) {
    throw new LesgoException('Dynamodb put failed', `${FILE}::FAILED`, 500, {
      err,
      params,
    });
  }
};

export default put;
