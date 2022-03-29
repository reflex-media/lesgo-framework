import config from 'Config/elasticsearch'; // eslint-disable-line import/no-unresolved
import OpenSearchService from '../services/opensearch/OpenSearchService';

const singleton = [];

const os = (conn = null) => {
  if (singleton[conn]) {
    return singleton[conn];
  }

  const instance = new OpenSearchService({
    ...config.adapters[conn || config.default],
  });

  singleton[conn] = instance;

  return instance;
};

export default os;
