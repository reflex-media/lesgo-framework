import getClient from './getClient';
import logger from '../../utils/logger';
import LesgoException from '../../exceptions/LesgoException';

const FILE = 'services/OpenSearchService/indexDocument';

/**
 * Add or update document to index
 *
 * const data = {
 *   name: 'John Doe',
 *   gender: 'male',
 *   profile: {
 *     aboutMe: 'Hi, I love to code!',
 *     headline: 'Do best at what you do',
 *     favoriteMovies: [
 *       {
 *         title: 'John Wick: Chapter 4',
 *         director: 'Chad Stahelski',
 *         genre: ['action', 'thriller'],
 *       },
 *       {
 *         title: 'Spider-Man: No Way Home',
 *         director: 'Jon Watts',
 *         genre: ['action', 'comedy'],
 *       },
 *     ],
 *   },
 *   location: {
 *     formattedAddress: '4775 W Harmon Ave Suite A, Las Vegas, NV 89103, USA',
 *     city: 'Las Vegas',
 *     state: 'Nevada',
 *     country: 'United States',
 *     lat: 36.1066296,
 *     lng: -115.2080718,
 *   },
 *   createdAt: 1681354668,
 *   updatedAt: 1681354668,
 * }
 */
const indexDocument = async (documentId, data, { adapter, singletonConn }) => {
  const client = await getClient(
    { region: adapter.region, host: adapter.host },
    singletonConn
  );
  logger.debug(`${FILE}::CLIENT`, { client });

  const param = {
    id: documentId,
    index: adapter.index.name,
    body: {
      ...data,
      lastIndexedAt: Date.now(),
    },
    refresh: true,
  };

  try {
    const resp = await client.index(param);
    logger.debug(`${FILE}::DOCUMENT_INDEXED`, { resp });
    return resp;
  } catch (err) {
    throw new LesgoException(
      'Failed to add document',
      `${FILE}::ERROR_ADD_DOCUMENT`,
      500,
      { err, param }
    );
  }
};

export default indexDocument;
