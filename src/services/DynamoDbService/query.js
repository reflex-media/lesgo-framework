import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import prepareQueryPayload from './prepareQueryPayload';
import connect from './connect';

const FILE = 'services/DynamoDbService/query';

const query = async (
  tableName,
  keyConditionExpression,
  expressionAttributeValues,
  { region, singletonConn, filterExpression = '', projectionExpression = '' }
) => {
  const params = prepareQueryPayload(
    tableName,
    keyConditionExpression,
    expressionAttributeValues,
    { filterExpression, projectionExpression }
  );
  logger.debug(`${FILE}::QUERY_PREPARED`, { params });

  const client = connect(singletonConn, { region });

  try {
    const data = await client.send(new QueryCommand(params));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
    return data.Items;
  } catch (err) {
    throw new LesgoException('Dynamodb query failed', `${FILE}::FAILED`, 500, {
      err,
      params,
    });
  }
};

export default query;
