import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import connect from './connect';
import prepareUpdatePayload from './prepareUpdatePayload';

const FILE = 'services/DynamoDbService/update';

const update = async (
  tableName,
  key,
  updateExpression,
  expressionAttributeValues,
  { region, singletonConn, conditionExpression = '' }
) => {
  const params = prepareUpdatePayload(
    tableName,
    key,
    updateExpression,
    expressionAttributeValues,
    { conditionExpression }
  );
  logger.debug(`${FILE}::QUERY_PREPARED`, { params });

  const client = connect(singletonConn, { region });

  try {
    const data = await client.send(new UpdateCommand(params));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
    return data;
  } catch (err) {
    throw new LesgoException('Dynamodb update failed', `${FILE}::FAILED`, 500, {
      err,
      params,
    });
  }
};

export default update;
