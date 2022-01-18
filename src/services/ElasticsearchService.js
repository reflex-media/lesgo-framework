import {
  Client as ElasticsearchClient,
  Connection as DefaultConnection,
} from '@elastic/elasticsearch';
import AwsConnection from './aws/AwsElasticsearchConnection';

class ElasticsearchService {
  constructor({ index, type, connection, options }) {
    this.index = index;
    this.type = type;
    this.options = options;

    this.setConnection(connection);
  }

  setConnection(conn) {
    let Connection = null;

    switch (conn) {
      case 'aws':
        Connection = AwsConnection;
        break;

      default:
        Connection = DefaultConnection;
        break;
    }

    this.client = new ElasticsearchClient({
      ...this.options,
      Connection,
    });

    return this;
  }

  getClient() {
    return this.client;
  }

  search(body) {
    const param = {
      index: this.index,
      type: this.type,
      body,
    };

    this.client.search(param, (err, response) => {
      if (err) return Promise.reject(err);

      this.result = response;
      return Promise.resolve(response);
    });
  }

  /**
   * @param {*} settings
   * @param {*} index
   *
   *  const settings = {
   *    index: {
   *       number_of_shards: 3,
   *       number_of_replicas: 2,
   *     },
   *   };
   */
  createIndices(settings, index = null) {
    const params = {
      index: index || this.index,
      body: settings,
    };

    this.client.indices.create(params, (err, response) => {
      if (err) return Promise.reject(err);
      return Promise.resolve(response);
    });
  }

  deleteIndices(index, options = {}) {
    const params = {
      index,
      ...options,
    };

    this.client.indices.delete(params, (err, response) => {
      if (err) return Promise.reject(err);
      return Promise.resolve(response);
    });
  }

  existIndices(index, options = {}) {
    const params = { index, ...options };

    this.client.indices.exists(params, (err, response) => {
      if (err) return Promise.reject(err);
      return Promise.resolve(response.body);
    });
  }

  putMapping(index, type, body) {
    const params = { index, type, body: { properties: body } };

    this.client.indices.putMapping(params, (err, response) => {
      if (err) return Promise.reject(err);
      return Promise.resolve(response);
    });
  }

  get(id) {
    const params = {
      index: this.index,
      type: this.type,
      id,
    };

    this.client.get(params, (err, response) => {
      if (err) return Promise.reject(err);
      return Promise.resolve(response);
    });
  }

  indexOrCreateById(body, refresh = false) {
    const params = {
      index: this.index,
      type: this.type,
      id: body.id,
      body,
      refresh,
    };

    this.client.index(params, (err, response) => {
      if (err) return Promise.reject(err);
      return Promise.resolve(response);
    });
  }

  bulkIndex(bodies) {
    this.client.bulk(
      { body: this.constructBulkIndex(bodies) },
      (err, response) => {
        if (err) return Promise.reject(err);
        return Promise.resolve(response);
      }
    );
  }

  create(id, body) {
    const params = {
      index: this.index,
      type: this.type,
      id,
      body,
    };

    this.client.index(params, (err, response) => {
      if (err) return Promise.reject(err);
      return Promise.resolve(response);
    });
  }

  updateById(id) {
    const params = {
      index: this.index,
      type: this.type,
      id,
    };

    this.client.get(params, (err, response) => {
      if (err) return Promise.reject(err);
      return Promise.resolve(response);
    });
  }

  /**
   * Bulk operation very confusing if read from documentation
   * use this example from blogs instead
   *
   * @ref https://taohiko.wordpress.com/2014/10/15/example-javascript-to-use-bulk-command-of-elasticsearch/
   */
  constructBulkIndex(bodies) {
    const bulk = [];

    bodies.forEach(body => {
      // array 0 - add index operation
      bulk.push({
        index: {
          _index: this.index,
          _type: this.type,
          _id: body.profile_id,
        },
      });
      // array 1 - profile attributes
      bulk.push(body);
    });

    return bulk;
  }
}

export default ElasticsearchService;
