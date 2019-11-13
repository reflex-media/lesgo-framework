import { elasticSearch as config } from '../config';
import ElasticSearchService from '../services/ElasticSearchService';

const singleton = [];

const es = (conn = null) => {
  if (singleton[conn]) {
    return singleton[conn];
  }

  const instance = new ElasticSearchService({
    ...config.adapters[conn || config.default],
  });

  singleton[conn] = instance;

  return instance;
};

export default es;
