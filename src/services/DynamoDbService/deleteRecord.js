import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import connect from './connect';
import prepareDeletePayload from './prepareDeletePayload';

const FILE = 'services/DynamoDbService/delete';

const deleteRecord = async (tableName, key, { region, singletonConn }) => {
  const params = prepareDeletePayload(tableName, key);
  logger.debug(`${FILE}::QUERY_PREPARED`, { params });

  const client = connect(singletonConn, { region });

  try {
    const data = await client.send(new DeleteCommand(params));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
    return data;
  } catch (err) {
    throw new LesgoException('Dynamodb delete failed', `${FILE}::FAILED`, 500, {
      err,
      params,
    });
  }
};

export default deleteRecord;
