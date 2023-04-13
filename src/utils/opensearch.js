import config from 'config/opensearch'; // eslint-disable-line import/no-unresolved
import OpenSearchService from '../services/OpenSearchService';

const singleton = [];

const opensearch = (conn = 'default') => {
  if (singleton[conn]) {
    return singleton[conn];
  }

  const adapter = config.adapters[conn === 'default' ? config.default : conn];

  const instance = new OpenSearchService(adapter);
  singleton[conn] = instance;
  return instance;
};

export default opensearch;
