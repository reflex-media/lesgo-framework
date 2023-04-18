import getClient from './getClient';
import logger from '../../utils/logger';
import LesgoException from '../../exceptions/LesgoException';

const FILE = 'services/OpenSearchService/searchIndex';

/**
 * Searches the index
 *
 * // Search for name: John Doe
 * const query = {
 *  query: {
 *    match: {
 *      name: {
 *        query: 'John Doe',
 *      },
 *    },
 *  },
 * };
 */
const searchIndex = async (query, { adapter, singletonConn }) => {
  const client = await getClient(
    { region: adapter.region, host: adapter.host },
    singletonConn
  );
  logger.debug(`${FILE}::CLIENT`, { client });

  const param = {
    index: adapter.index.name,
    body: {
      query,
    },
  };

  try {
    const resp = await client.search(param);
    logger.debug(`${FILE}::SEARCH_RESULT`, { resp, param });
    return resp;
  } catch (err) {
    throw new LesgoException(
      'Failed to search document',
      `${FILE}::ERROR_SEARCH`,
      500,
      { err, param }
    );
  }
};

export default searchIndex;
