import getClient from './getClient';
import logger from '../../utils/logger';
import LesgoException from '../../exceptions/LesgoException';

const FILE = 'services/OpenSearchService/deleteDocument';

const deleteDocument = async (documentId, { adapter, singletonConn }) => {
  const client = await getClient(
    { region: adapter.region, host: adapter.host },
    singletonConn
  );
  logger.debug(`${FILE}::CLIENT`, { client });

  try {
    const resp = await client.delete({
      index: adapter.index.name,
      id: documentId,
    });
    logger.debug(`${FILE}::DELETED`, { resp });
    return resp;
  } catch (err) {
    throw new LesgoException(
      'Failed to delete document',
      `${FILE}::ERROR`,
      500,
      { err, client }
    );
  }
};

export default deleteDocument;
