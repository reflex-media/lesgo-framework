import ElasticsearchService from '../ElasticsearchService';

class OpenSearchSupportDecorator {
  constructor({ index, type, connection, options }) {
    this.esService = new ElasticsearchService({
      index,
      type,
      connection,
      options,
    });
  }

  getClient() {
    return this.esService.getClient();
  }

  async search(body) {
    return this.esService.search(body);
  }

  createIndices(settings, index = null) {
    return this.esService.createIndices(settings, index);
  }

  deleteIndices(index, options = {}) {
    return this.esService.deleteIndices(index, options);
  }

  async existIndices(index, options = {}) {
    return this.esService.existIndices(index, options);
  }

  putMapping(index, type, body) {
    return this.esService.putMapping(index, type, body);
  }

  get(id) {
    return this.esService.get(id);
  }

  msearch(body) {
    return this.esService.msearch(body);
  }

  indexOrCreateById(body, refresh = false) {
    return this.esService.indexOrCreateById(body, refresh);
  }

  bulkIndex(bodies) {
    return this.esService.bulkIndex(bodies);
  }

  create(id, body) {
    return this.esService.create(id, body);
  }

  updateById(id) {
    return this.esService.updateById(id);
  }
}

export default OpenSearchSupportDecorator;
