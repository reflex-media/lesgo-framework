import LesgoException from '../../exceptions/LesgoException';
import logger from '../../utils/logger';
import getClient from './getClient';

const FILE = 'services/OpenSearchService/createIndex';

const createIndex = async ({ adapter, singletonConn }) => {
  const client = await getClient(
    { region: adapter.region, host: adapter.host },
    singletonConn
  );
  logger.debug(`${FILE}::CLIENT`, { client });

  const params = {
    index: adapter.index.name,
    body: {
      settings: {
        index: {
          number_of_shards: adapter.index.numShards,
          number_of_replicas: adapter.index.numReplicas,
        },
      },
      mappings: {
        ...adapter.index.mappings,
        properties: {
          ...adapter.index.mappings.properties,
          lastIndexedAt: { type: 'date' },
        },
      },
    },
  };

  try {
    const resp = await client.indices.create(params);
    logger.debug(`${FILE}::CREATED`, { resp, params });
    return resp;
  } catch (err) {
    throw new LesgoException('Failed to create index', `${FILE}::ERROR`, 500, {
      err,
      params,
    });
  }
};

export default createIndex;
