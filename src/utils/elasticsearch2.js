import config from 'Config/elasticsearch'; // eslint-disable-line import/no-unresolved
import ElasticsearchService from '../services/ElasticsearchService2';

const singleton = [];

const es = (conn = null) => {
  if (singleton[conn]) {
    return singleton[conn];
  }

  const instance = new ElasticsearchService({
    ...config.adapters[conn || config.default],
  });

  singleton[conn] = instance;

  return instance;
};

export default es;
