import getClient from './getClient';
import logger from '../../utils/logger';
import LesgoException from '../../exceptions/LesgoException';

const FILE = 'services/OpenSearchService/deleteIndex';

const deleteIndex = async ({ adapter, singletonConn }) => {
  const client = await getClient(
    { region: adapter.region, host: adapter.host },
    singletonConn
  );
  logger.debug(`${FILE}::CLIENT`, { client });

  const params = {
    index: adapter.index.name,
  };

  try {
    const resp = await client.indices.delete(params);
    logger.debug(`${FILE}::DELETED`, { resp, params });
    return resp;
  } catch (err) {
    throw new LesgoException('Failed to delete index', `${FILE}::ERROR`, 500, {
      err,
      params,
    });
  }
};

export default deleteIndex;
