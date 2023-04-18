import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import connect from './connect';
import prepareQueryCountPayload from './prepareQueryCountPayload';

const FILE = 'services/DynamoDbService/queryCount';

const queryCount = async (
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  { region, singletonConn }
) => {
  const params = prepareQueryCountPayload(
    tableName,
    keyConditionExpression,
    expressionAttributeValues
  );
  logger.debug(`${FILE}::QUERY_PREPARED`, { params });

  const client = connect(singletonConn, { region });

  try {
    const data = await client.send(new QueryCommand(params));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
    return data.Count;
  } catch (err) {
    throw new LesgoException(
      'Dynamodb query count failed',
      `${FILE}::FAILED`,
      500,
      {
        err,
        params,
      }
    );
  }
};

export default queryCount;
