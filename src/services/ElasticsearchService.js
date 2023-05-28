import {
  Client as ElasticsearchClient,
  Connection as DefaultConnection,
} from '@elastic/elasticsearch';
import AwsConnection from './aws/AwsElasticsearchConnection';

class ElasticsearchService {
  constructor({ index, type, connection, options, client }) {
    this.index = index;
    this.type = type;
    this.options = options;

    this.setConnection(connection, client);
  }

  setConnection(conn, client) {
    let Connection = null;

    switch (conn) {
      case 'aws':
        Connection = AwsConnection;
        break;

      default:
        Connection = DefaultConnection;
        break;
    }

    this.client =
      typeof client === 'undefined' || client === null || client === false
        ? new ElasticsearchClient({
            ...this.options,
            Connection,
          })
        : client;

    return this;
  }

  getClient() {
    return this.client;
  }

  async search(body) {
    const param = {
      index: this.index,
      type: this.type,
      body,
    };

    const response = await this.client.search(param);

    this.result = response;

    return response;
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

    return this.client.indices.create(params);
  }

  deleteIndices(index, options = {}) {
    const params = {
      index,
      ...options,
    };

    return this.client.indices.delete(params);
  }

  async existIndices(index, options = {}) {
    const params = { index, ...options };

    const response = await this.client.indices.exists(params);
    return response.body;
  }

  putMapping(index, type, body) {
    const params = { index, type, body: { properties: body } };

    return this.client.indices.putMapping(params);
  }

  get(id) {
    const params = {
      index: this.index,
      type: this.type,
      id,
    };

    return this.client.get(params);
  }

  /**
   * Multi search API
   *
   * Executes several searches with a single API request.
   *
   * @see https://www.elastic.co/guide/en/elasticsearch/reference/7.16/search-multi-search.html
   */
  msearch(body) {
    return this.client.msearch({ body });
  }

  indexOrCreateById(body, refresh = false) {
    const params = {
      index: this.index,
      type: this.type,
      id: body.id,
      body,
      refresh,
    };

    return this.client.index(params);
  }

  bulkIndex(bodies) {
    return this.client.bulk({ body: this.constructBulkIndex(bodies) });
  }

  create(id, body) {
    const params = {
      index: this.index,
      type: this.type,
      id,
      body,
    };

    return this.client.index(params);
  }

  updateById(id) {
    const params = {
      index: this.index,
      type: this.type,
      id,
    };

    return this.client.get(params);
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
