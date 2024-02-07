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

  let size = null;

  if (typeof query.size !== 'undefined') {
    size = query.size;
    delete query.size;
  }

  let sort = null;

  if (typeof query.sort !== 'undefined') {
    sort = query.sort;
    delete query.sort;
  }

  let param = {
    index: adapter.index.name,
    body: {
      query,
    },
  };

  if (size !== null) {
    param.body.size = size;
  }

  if (sort !== null) {
    param.body.sort = sort;
  }
  
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
